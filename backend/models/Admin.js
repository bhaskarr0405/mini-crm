const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Admin' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true } // stored as bcrypt hash
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', AdminSchema);
