import express from 'express';
import Reminder from '../models/Reminder.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Set a reminder for an event
// @route   POST /api/reminders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, type = '1_day_before' } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Calculate reminder time
        const eventDate = new Date(event.date);
        let reminderTime = new Date(eventDate);

        if (type === '1_day_before') {
            reminderTime.setDate(eventDate.getDate() - 1);
        } else if (type === '1_hour_before') {
            reminderTime.setHours(eventDate.getHours() - 1);
        }

        // Create reminder
        const reminder = await Reminder.create({
            userId: req.user.id,
            eventId,
            reminderTime,
            type
        });

        res.json({ success: true, message: 'Reminder set successfully', data: reminder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get user reminders
// @route   GET /api/reminders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user.id })
            .populate('eventId', 'title date time venue')
            .sort({ reminderTime: 1 });

        res.json({ success: true, data: reminders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
