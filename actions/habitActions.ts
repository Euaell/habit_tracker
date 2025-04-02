/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getServerUser from "@/lib/auth/user-provider";
import * as habitService from "@/services/habitServices";
import { HabitEntryStatus } from "@/types/habitEntry";
import { CreateHabit, UpdateHabit } from '@/types/habits';
import ID from "@/types/id";


async function getAuthenticatedUserId(): Promise<ID> {
     const user = await getServerUser();
     return user.id as ID
}

export async function createHabitAction(formData: CreateHabit) {
    const userId = await getAuthenticatedUserId();
    try {
        await habitService.createHabit(formData, userId);
    } catch (error: any) {
        console.error("Create Habit Action Error:", error);
        return { success: false, message: error.message || "Failed to create habit." };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function updateHabitAction(habitId: string, formData: UpdateHabit) {
    const userId = await getAuthenticatedUserId();
     try {
        const updated = await habitService.updateHabit(habitId, userId, formData);
        if (!updated) {
             return { success: false, message: "Habit not found or update failed." };
        }
    } catch (error: any) {
        console.error("Update Habit Action Error:", error);
        return { success: false, message: error.message || "Failed to update habit." };
    }

    revalidatePath(`/dashboard`);
    revalidatePath(`/habits/${habitId}`);
    return { success: true, message: "Habit updated!" };
}


export async function archiveHabitAction(habitId: string) {
    const userId = await getAuthenticatedUserId();
    try {
        const success = await habitService.archiveHabit(habitId, userId);
         if (!success) {
             return { success: false, message: "Habit not found or already archived." };
        }
    } catch (error: any) {
        console.error("Archive Habit Action Error:", error);
        return { success: false, message: error.message || "Failed to archive habit." };
    }

    // Revalidate the dashboard
    revalidatePath('/dashboard');
    return { success: true, message: "Habit archived." };
}


export async function checkInHabitAction(habitId: string, date: Date, status: HabitEntryStatus, notes?: string) {
    const userId = await getAuthenticatedUserId();
    try {
        const result = await habitService.recordHabitEntry({ habitId, userId, date, status, notes });
        if (!result.success) {
            return { success: false, message: result.message ?? "Failed to record check-in." };
        }
    } catch (error: any) {
        console.error("Check-in Habit Action Error:", error);
        return { success: false, message: error.message || "Failed to record check-in." };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/habits/${habitId}`);
     return { success: true, message: `Habit marked as ${status}.` };
}