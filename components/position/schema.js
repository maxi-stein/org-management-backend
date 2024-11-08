import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema(
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
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default positionSchema;
