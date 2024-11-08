const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema(
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
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Area', areaSchema);
