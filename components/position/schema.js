import mongoose from 'mongoose';

export const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    level: { type: String, trim: true, default: null }, //Junior, Semi-Senior, Senior, etc.
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  },
  { timestamps: true },
);

//index for title and level, allowing the level to be null.
positionSchema.index({ title: 1, level: 1 }, { unique: true });
