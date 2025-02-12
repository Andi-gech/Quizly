const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 10 * 60 * 1000 // 10 minutes
  }
});

verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);