import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import ScraperOrchestrator from '../scrapers/ScraperOrchestrator.js';
import { sendNewEventAlert } from '../services/emailService.js';

const router = express.Router();


router.get('/events', async (req, res) => {
    try {
        const orchestrator = new ScraperOrchestrator();
        const scrapedEvents = await orchestrator.scrapeAll();

        let savedCount = 0;
        const users = await User.find({});

        for (const eventData of scrapedEvents) {
            try {

                const existingEvent = await Event.findOne({
                    title: eventData.title,
                    date: eventData.date
                });

                if (!existingEvent) {
                    const newEvent = await Event.create(eventData);
                    savedCount++;

                    // Send Alert
                    if (users.length > 0) {
                        await sendNewEventAlert(users, newEvent);
                    }
                }
            } catch (err) {
                console.error(`Error saving event: ${eventData.title}`, err.message);
            }
        }

        res.json({
            success: true,
            message: `Scraped ${scrapedEvents.length} events, saved ${savedCount} new events`,
            events: scrapedEvents
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
