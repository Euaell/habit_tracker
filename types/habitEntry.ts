import ID from "./id";

/*
_id: ObjectId (Primary Key)
habitId: ObjectId (Reference to habits, Indexed)
userId: ObjectId (Reference to users, Indexed)
date: Date (Store the date it applies to, ideally normalized to UTC midnight, Indexed)
status: String ('completed', 'missed', 'skipped' for 'build' / 'avoided', 'lapsed', 'skipped' for 'quit')
notes: String (Optional)
createdAt: Date (Timestamp when the record was actually created)
*/ 

export default interface HabitEntry {
    id: ID
    habitId: ID
    userId: ID
    date: Date  // Store the date it applies to, ideally normalized to UTC midnight
    status: HabitEntryStatus
    notes?: string
    createdAt: Date
}

export type HabitEntryStatus = 'completed' | 'missed' | 'skipped' | 'avoided' | 'lapsed'
