import mongoose from 'mongoose';

export const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: true, // Every departement belongs to an area
    },
  },
  { timestamps: true },
);
