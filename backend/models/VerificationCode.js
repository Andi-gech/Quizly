const mongoose = require('mongoose');


const VerificationCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema);