const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  caller: { type: String, required: true },
  receiver: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  callType: { type: String, enum: ['audio', 'video'], required: true },
  status: { type: String, enum: ['answered', 'missed', 'rejected', 'initiated'], required: true }, // Add 'initiated' here
});

module.exports = mongoose.model('CallLog', callLogSchema);
