import { hashPassword } from '../utils/passwordHelper';

const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    memberName: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const memberModel = mongoose.model('Member', memberSchema);

export default memberModel;
