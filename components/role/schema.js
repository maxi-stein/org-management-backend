import mongoose from 'mongoose';

const { Schema } = mongoose;

export const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true },
);
