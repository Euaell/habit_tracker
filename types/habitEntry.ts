import ID from "./id";

export interface HabitEntry {
    id: ID
    habitId: ID
    userId: ID
    date: Date  // Store the date it applies to, ideally normalized to UTC midnight
    status: HabitEntryStatus
    notes?: string
    createdAt: Date
}

export type HabitEntryStatus = 'completed' | 'missed' | 'skipped' | 'avoided' | 'lapsed'
