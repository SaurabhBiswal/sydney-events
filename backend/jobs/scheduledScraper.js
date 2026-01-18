import cron from 'node-cron';
import ScraperOrchestrator from '../scrapers/ScraperOrchestrator.js';
import Event from '../models/Event.js';

// Schedule scraper to run daily at 2:00 AM
// CRON format: minute hour day month weekday
// '0 2 * * *' = Every day at 2:00 AM
cron.schedule('0 2 * * *', async () => {
    console.log('🕐 [CRON] Running scheduled event scraper...');

    try {
        const orchestrator = new ScraperOrchestrator();
        const scrapedEvents = await orchestrator.scrapeAll();

        let savedCount = 0;

        for (const eventData of scrapedEvents) {
            try {
                // Check if event already exists (by title and date)
                const existingEvent = await Event.findOne({
                    title: eventData.title,
                    date: eventData.date
                });

                if (!existingEvent) {
                    await Event.create(eventData);
                    savedCount++;
                }
            } catch (err) {
                console.error(`Error saving event: ${eventData.title}`, err.message);
            }
        }

        console.log(`✅ [CRON] Scraper completed. Saved ${savedCount} new events.`);
    } catch (error) {
        console.error('❌ [CRON] Scraper failed:', error.message);
    }
});

console.log('⏰ Scheduled scraper initialized (runs daily at 2:00 AM)');
