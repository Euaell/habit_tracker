import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { HabitEntry as HabitEntryType } from '@/types/habitEntry'; // Adjust path

export interface HabitEntryDocument extends HabitEntryType, Omit<Document, 'id'> {
  _id: Schema.Types.ObjectId;
}

const HabitEntrySchema = new Schema<HabitEntryDocument>({
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Store date normalized to midnight UTC for consistent day checking
    date: { type: Date, required: true, index: true },
    status: { type: String, required: true, enum: ['completed', 'missed', 'skipped', 'avoided', 'lapsed'] },
    notes: { type: String, trim: true },
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

HabitEntrySchema.virtual('id').get(function() {
  return this._id.toString();
});

// Compound index for faster lookups of a user's entry for a specific habit on a specific date
HabitEntrySchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

const HabitEntry: Model<HabitEntryDocument> = models.HabitEntry || mongoose.model<HabitEntryDocument>('HabitEntry', HabitEntrySchema);

export default HabitEntry;
