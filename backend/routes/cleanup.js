import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();


router.get('/cleanup-fake', async (req, res) => {
    try {
        const fakeEventTitles = [
            'Sydney Opera House Jazz Night',
            'Sydney Cricket Test Match',
            'Tech Startup Summit 2024',
            'Sydney Swans vs GWS Giants',
            'Bondi Beach Food Festival',
            'Vivid Sydney Light Festival'
        ];

        const result = await Event.deleteMany({
            title: { $in: fakeEventTitles }
        });

        res.json({
            success: true,
            message: `Deleted ${result.deletedCount} fake events`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
