import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import bcrypt from 'bcrypt';
import { LevelEnum } from '../position/schema.js';

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;
const emailValidator = validate({ validator: 'isEmail' });

export const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: emailValidator,
    },
    //Password must have one lowercase, one uppercase, one number and at least 8 characters.
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
    },
    role: { type: ObjectId, ref: 'Role', required: true },
    supervisedEmployees: [{ type: ObjectId, ref: 'User' }],
    phone: { type: String, trim: true, required: true },
    bornDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    position: {
      type: ObjectId,
      ref: 'Position',
    },
    positionLevel: {
      type: String,
      enum: LevelEnum.map((level) => level.value),
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.method(
  'checkPassword',
  async function checkPassword(potentialPassword) {
    if (!potentialPassword) {
      return Promise.reject(new Error('Password is required'));
    }

    const isMatch = await bcrypt.compare(potentialPassword, this.password);

    return { isOk: isMatch, isLocked: !this.isActive };
  },
);
