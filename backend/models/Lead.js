const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    followUpDate: { type: Date }, // optional scheduled follow-up
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    source: {
      type: String,
      enum: ['Website Form', 'Referral', 'Social Media', 'Cold Call', 'Advertisement', 'Other'],
      default: 'Website Form'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new'
    },
    message: { type: String, trim: true }, // original message from the contact form
    notes: [NoteSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);
