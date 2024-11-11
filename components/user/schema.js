import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import bcrypt from 'bcrypt';

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
    supervisor: { type: ObjectId, ref: 'User', default: null },
    phone: { type: String, trim: true, required: true },
    bornDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
    },
  },
  { timestamps: true },
  { versionKey: false },
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
