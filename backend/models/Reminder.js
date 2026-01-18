import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    reminderTime: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['1_day_before', '1_hour_before'],
        default: '1_day_before'
    },
    sent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Reminder', reminderSchema);
