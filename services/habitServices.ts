import dbConnect from "@/lib/db/connect";
import Habit, { HabitDocument } from "@/models/habit";
import HabitEntry, { HabitEntryDocument } from "@/models/habitEntry";
import mongoose from "mongoose";
import { CreateHabit, UpdateHabit } from '@/types/habits';
import { HabitEntryStatus } from "@/types/habitEntry";
import { subDays, isSameDay } from 'date-fns';
import ID from "@/types/id";

/**
 * Normalizes a date to the start of the day (midnight) in UTC.
 * Crucial for consistent date comparisons regardless of timezones or time of check-in.
 */
function normalizeDateUTC(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}


export async function getUserHabits(userId: ID): Promise<HabitDocument[]> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        throw new Error("Invalid user ID format");
    }
    const habits = await Habit.find({ userId, archived: false }).sort({ createdAt: -1 }).lean();
    // Convert _id to id if needed, or rely on virtuals if models are not lean
    return habits.map(h => ({ ...h, id: h._id.toString() })) as HabitDocument[];
}

export async function getHabitById(habitId: string, userId: ID): Promise<HabitDocument | null> {
    await dbConnect();
     if (!mongoose.Types.ObjectId.isValid(userId as string) || !mongoose.Types.ObjectId.isValid(habitId)) {
        throw new Error("Invalid ID format");
    }
    const habit = await Habit.findOne({ _id: habitId, userId }).lean();
    return habit ? { ...habit, id: habit._id.toString() } as HabitDocument : null;
}

export async function createHabit(data: CreateHabit, userId: ID): Promise<HabitDocument> {
    await dbConnect();
     if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        throw new Error("Invalid user ID format");
    }
    const habit = new Habit({ ...data, userId });
    await habit.save();
    return habit.toObject({ virtuals: true }) as HabitDocument; // Use toObject to include virtuals
}


export async function updateHabit(habitId: string, userId: ID, data: UpdateHabit): Promise<HabitDocument | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(userId as string) || !mongoose.Types.ObjectId.isValid(habitId)) {
        return null;
    }

    const updatedHabit = await Habit.findOneAndUpdate(
        { _id: habitId, userId },
        { $set: data },
        { new: true, runValidators: true } // Return the updated doc and run schema validators
    ).lean();

    return updatedHabit ? { ...updatedHabit, id: updatedHabit._id.toString() } as HabitDocument : null;
}

export async function archiveHabit(habitId: string, userId: ID): Promise<boolean> {
     await dbConnect();
     if (!mongoose.Types.ObjectId.isValid(userId as string) || !mongoose.Types.ObjectId.isValid(habitId)) {
        return false;
    }
    const result = await Habit.updateOne({ _id: habitId, userId }, { $set: { archived: true } });
    return result.modifiedCount > 0;
}

export async function getHabitEntries(habitId: string, userId: ID, startDate: Date, endDate: Date): Promise<HabitEntryDocument[]> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(userId as string) || !mongoose.Types.ObjectId.isValid(habitId)) {
        return [];
    }

    const entries = await HabitEntry.find({
        habitId,
        userId,
        date: { $gte: normalizeDateUTC(startDate), $lte: normalizeDateUTC(endDate) }
    }).sort({ date: 1 }).lean(); // Sort chronologically

    return entries.map(e => ({ ...e, id: e._id.toString() })) as HabitEntryDocument[];
}


// --- Check-in and Streak Logic ---

interface RecordEntryParams {
    habitId: string;
    userId: ID;
    date: Date; // The date the entry applies to (can be backdated)
    status: HabitEntryStatus;
    notes?: string;
}

export async function recordHabitEntry({ habitId, userId, date, status, notes }: RecordEntryParams): Promise<{ success: boolean; message?: string }> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(userId as string) || !mongoose.Types.ObjectId.isValid(habitId)) {
         return { success: false, message: "Invalid ID format." };
    }

    const normalizedDate = normalizeDateUTC(date);
    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
        return { success: false, message: "Habit not found or doesn't belong to user." };
    }

    try {
        // Update if exists for this date, otherwise insert
        await HabitEntry.updateOne(
            { habitId, userId, date: normalizedDate },
            { $set: { status, notes }, $setOnInsert: { createdAt: new Date() } }, // Update status/notes, set createdAt only on insert
            { upsert: true, runValidators: true }
        );

        // After successful entry, update the streak
        await calculateAndUpdateStreak(habit, normalizedDate, status);

        return { success: true };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error recording habit entry:", error);
        // Handle potential unique constraint violation if upsert fails unexpectedly
        if (error.code === 11000) {
             return { success: false, message: "Entry potentially already exists (concurrent request?)" };
        }
        return { success: false, message: error.message || "Failed to record entry." };
    }
}

// --- Streak Calculation for Daily, Build,
// TODO: needs to handle:
// - 'quit' habits (streak increases when not logged or logged as 'avoided')
// - Recurrence rules (weekly, N days, etc.)
// - Skipped days ('skipped' status might pause or break the streak based on rules)
// - Timezones, currently using UTC
// - Lapsed habits (for quit) (should reset streak?)
// - Missed days (for build) (should reset streak?)
async function calculateAndUpdateStreak(habit: HabitDocument, entryDate: Date, entryStatus: HabitEntryStatus): Promise<void> {
    // Only calculate for 'build' habits marked 'completed' in this simplified example
    if (habit.type !== 'build' || entryStatus !== 'completed') {
        // For 'quit' habits or non-completed entries, different logic applies
        // Maybe reset streak if 'missed' or 'lapsed'?
        // Potentially reset if it's a 'build' habit and status is 'missed'
        if (habit.type === 'build' && entryStatus === 'missed') {
             habit.streak = 0;
             await habit.save();
        }
        return;
    }

    const today = normalizeDateUTC(entryDate);
    const lastCompleted = habit.lastCompletedDate ? normalizeDateUTC(habit.lastCompletedDate) : null;

    let newStreak = habit.streak || 0;

    if (lastCompleted) {
        const yesterday = normalizeDateUTC(subDays(today, 1));

        if (isSameDay(lastCompleted, today)) {
            // Already completed today, no change in streak (idempotent)
            return;
        } else if (isSameDay(lastCompleted, yesterday)) {
            // Completed yesterday, increment streak
            newStreak++;
        } else {
            // Missed a day (or more), reset streak to 1 (for today's completion)
            newStreak = 1;
        }
    } else {
        // First time completing this habit
        newStreak = 1;
    }

    habit.streak = newStreak;
    habit.lastCompletedDate = today; // Update last completed date

    if (newStreak > (habit.longestStreak || 0)) {
        habit.longestStreak = newStreak;
    }

    await habit.save();
}
