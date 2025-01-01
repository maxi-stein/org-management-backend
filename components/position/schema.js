import mongoose from 'mongoose';

export const LevelEnum = Object.freeze({
  JR: 'Junior',
  SSR: 'Semi-Senior',
  SR: 'Senior',
});

export const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: Object.keys(LevelEnum),
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

positionSchema.index({ title: 1, level: 1 }, { unique: true });
