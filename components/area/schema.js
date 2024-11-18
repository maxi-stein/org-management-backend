import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

export const areaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    departments: [
      {
        type: ObjectId,
        ref: 'Department',
      },
    ],
  },
  { timestamps: true },
);
