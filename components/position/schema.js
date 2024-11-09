import mongoose from 'mongoose';

export const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    level: { type: Number, required: true }, //Junior, Semi-Senior, Senior, etc.
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    reportsTo: {
      //This user Supervisor
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
  },
  { timestamps: true },
);
