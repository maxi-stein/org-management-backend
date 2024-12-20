import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

export const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    //head of department
    head: {
      type: ObjectId,
      ref: 'User',
      required: false,
      unique: true,
    },
  },
  { timestamps: true },
);
