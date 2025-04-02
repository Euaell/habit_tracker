import ID from "./id";

/* 
habits:
_id: ObjectId (Primary Key)
userId: ObjectId (Reference to users, Indexed)
name: String
description: String (Optional)
type: String ('build' | 'quit')
color: String (Optional hex code)
icon: String (Optional icon identifier)
timeOfDay: Array of Strings (['morning', 'afternoon', 'evening'])
recurrence: Object (Stores the rules)
    type: String ('daily', 'weekly', 'every_n_days', 'times_per_week')
    daysOfWeek: Array of Numbers (Optional, 0-6 for Sun-Sat, used if type is 'weekly')
    interval: Number (Optional, e.g., 2 for 'every_n_days')
    times: Number (Optional, e.g., 3 for 'times_per_week')
    weekStartsOn: Number (Optional, 0 or 1, relevant for 'times_per_week')
streak: Number (Current streak count, denormalized for quick display)
longestStreak: Number (Denormalized)
lastCompletedDate: Date (Optional, helps in streak calculation)
createdAt: Date
archived: Boolean (Default: false)
*/
export default interface Habit {
    id: ID
    userId: ID
    name: string
    description?: string
    type: 'build' | 'quit'
    color?: string
    icon?: string
    timeOfDay: timeOfDay[]
    recurrence: Recurrence
    streak: number
    longestStreak: number
    lastCompletedDate?: Date
    createdAt: Date
    archived: boolean
}

export type RecurrenceType = 'daily' | 'weekly' | 'every_n_days' | 'times_per_week'
export type timeOfDay = 'morning' | 'afternoon' | 'evening'

export interface Recurrence {
    type: RecurrenceType
    daysOfWeek?: number[] // 0-6 for Sun-Sat, used if type is 'weekly'
    interval?: number // e.g., 2 for 'every_n_days'
    times?: number // e.g., 3 for 'times_per_week'
    weekStartsOn?: number // 0 or 1, relevant for 'times_per_week'
}