import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Habit as HabitType, Recurrence } from '@/types/habits'; // Adjust path if needed

const RecurrenceSchema = new Schema<Recurrence>({
    type: { type: String, required: true, enum: ['daily', 'weekly', 'every_n_days', 'times_per_week'] },
    daysOfWeek: { type: [Number], default: undefined },
    interval: { type: Number, default: undefined },
    times: { type: Number, default: undefined },
    weekStartsOn: { type: Number, default: undefined },
}, { _id: false });

export interface HabitDocument extends HabitType, Omit<Document, 'id'> {
  _id: Schema.Types.ObjectId; // Ensure _id exists
}

const HabitSchema = new Schema<HabitDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, required: true, enum: ['build', 'quit'] },
    color: { type: String },
    icon: { type: String },
    timeOfDay: {
        type: [{ type: String, enum: ['morning', 'afternoon', 'evening'] }],
        required: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate: [(v: any) => Array.isArray(v) && v.length > 0, 'At least one time of day is required']
    },
    recurrence: { type: RecurrenceSchema, required: true },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },
    archived: { type: Boolean, default: false, index: true },
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Ensure virtuals are included if needed
    toObject: { virtuals: true }
});

// Virtual for 'id' if you prefer using 'id' on the frontend
HabitSchema.virtual('id').get(function() {
  return this._id.toString();
});

const Habit: Model<HabitDocument> = models.Habit || mongoose.model<HabitDocument>('Habit', HabitSchema);

export default Habit;
