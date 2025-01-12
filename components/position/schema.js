import mongoose from 'mongoose';

export const LevelEnum = [
  { value: 'JR', label: 'Junior' },
  { value: 'SSR', label: 'Semi-Senior' },
  { value: 'SR', label: 'Senior' },
];

export const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);
