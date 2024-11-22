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
      maxlength: 200,
    },
    //head of department
    head: {
      type: ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);
