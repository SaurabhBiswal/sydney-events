import axios from 'axios';
import * as cheerio from 'cheerio';

class EventbriteScraper {
    constructor() {
        this.baseUrl = 'https://www.eventbrite.com/d/australia--sydney/events/';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        };
    }

    async scrapeEvents() {
        try {
          
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                }
            });

            const $ = cheerio.load(response.data);
            const scrapedEvents = [];

            
            $('div.eds-event-card-content__primary-content').each((i, el) => {
                const title = $(el).find('div.eds-event-card__formatted-name--is-clamped').text().trim();
                const dateStr = $(el).find('div.eds-event-card-content__sub-title').text().trim();
                const location = $(el).find('div.eds-event-card-content__sub-content').text().trim();
                const link = $(el).find('a').attr('href');

                if (title && link) {
                    scrapedEvents.push({
                        title,
                        date: new Date(), 
                        time: "7:00 PM", 
                        location: location || 'Sydney, Australia',
                        venue: location || 'Sydney, Australia', 
                        description: `Event at ${location}`,
                        price: 'Check Link',
                        category: 'General',
                        sourceUrl: link.startsWith('http') ? link : `https://www.eventbrite.com${link}`,
                        imageUrl: 'https://images.unsplash.com/photo-1549451371-64d483901771?w=800&q=80',
                        isActive: true
                    });
                }
            });

            if (scrapedEvents.length > 0) {
                console.log(`Successfully scraped ${scrapedEvents.length} real events.`);
                return scrapedEvents;
            } else {
                throw new Error("No events found (Selectors might have changed or Bot detection active)");
            }

        } catch (error) {
            
            console.warn(`Scraping blocked/failed (${error.message}). No mock data - system relies on real scraping.`);

          
            return [];
        }
    }

    categorizeEvent(text) {
        const lower = text.toLowerCase();
        if (lower.includes('music') || lower.includes('concert') || lower.includes('jazz') || lower.includes('band')) return 'Music';
        if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dining') || lower.includes('festival') || lower.includes('cafe')) return 'Food';
        if (lower.includes('tech') || lower.includes('startup') || lower.includes('innovation')) return 'Technology';
        if (lower.includes('sport') || lower.includes('cricket') || lower.includes('football') || lower.includes('rugby')) return 'Sports';
        if (lower.includes('art') || lower.includes('gallery') || lower.includes('exhibition') || lower.includes('theatre') || lower.includes('vivid')) return 'Arts';
        return 'General';
    }
}

export default EventbriteScraper;
