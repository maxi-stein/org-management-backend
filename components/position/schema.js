import mongoose from 'mongoose';

export const LevelEnum = Object.freeze({
  JR: 'Junior',
  SSR: 'Semi-Senior',
  SR: 'Senior',
});

export const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);
