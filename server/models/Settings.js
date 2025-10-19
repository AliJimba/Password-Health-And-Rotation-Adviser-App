const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    alertThreshold: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    },
    reminderEnabled: {
        type: Boolean,
        default: false
    },
    reminderInterval: {
        type: String,
        enum: ['1s', '1week', '1month', '3months', '6months'],
        default: '1month'
    },
    realtimeScanning: {
        type: Boolean,
        default: false
    },
    lastReminderSent: {
        type: Date,
        default: null
    },
    scanningStartedAt: {
        type: Date,
        default: null
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
settingsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Settings', settingsSchema);
