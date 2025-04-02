import ID from "./id";

export interface UpdateHabit {
    name: string
    description?: string
    type: 'build' | 'quit'
    color?: string
    icon?: string
    timeOfDay: timeOfDay[]
    recurrence: Recurrence
}

export interface Habit extends UpdateHabit {
    id: ID
    userId: ID

    streak: number
    longestStreak: number
    lastCompletedDate?: Date
    createdAt: Date
    archived: boolean
}

export type CreateHabit = Omit<Habit, 'id' | 'userId' | 'streak' | 'longestStreak' | 'lastCompletedDate' | 'createdAt' | 'archived'>;

export type RecurrenceType = 'daily' | 'weekly' | 'every_n_days' | 'times_per_week'
export type timeOfDay = 'morning' | 'afternoon' | 'evening'

export interface Recurrence {
    type: RecurrenceType
    daysOfWeek?: number[] // 0-6 for Sun-Sat, used if type is 'weekly'
    interval?: number // e.g., 2 for 'every_n_days'
    times?: number // e.g., 3 for 'times_per_week'
    weekStartsOn?: number // 0 or 1, relevant for 'times_per_week'
}