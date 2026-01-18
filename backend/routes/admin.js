import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Apply protection and admin check to all routes
router.use(protect);
router.use(admin);

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();
        const activeEvents = await Event.countDocuments({ isActive: true });

        res.json({
            success: true,
            stats: {
                totalEvents,
                totalUsers,
                activeEvents
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create new event manually
// @route   POST /api/admin/events
router.post('/events', async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
router.put('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
router.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        await event.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
