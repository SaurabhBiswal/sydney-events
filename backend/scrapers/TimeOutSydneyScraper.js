import puppeteer from 'puppeteer';

class TimeOutSydneyScraper {
    constructor() {
        this.baseUrl = 'https://www.timeout.com/sydney/things-to-do/whats-on-in-sydney-today';
    }

    async scrapeEvents() {
        console.log('🕷️ [TimeOut Sydney] Starting scraper...');
        let browser;

        try {
            
            browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();

            
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            
            await page.goto(this.baseUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            
            await page.waitForSelector('article', { timeout: 10000 });

            
            const events = await page.evaluate(() => {
                const eventElements = document.querySelectorAll('article');
                const scrapedEvents = [];

                eventElements.forEach((article, index) => {
                    if (index >= 10) return; 

                    const titleEl = article.querySelector('h3, h2, .title');
                    const linkEl = article.querySelector('a');
                    const imgEl = article.querySelector('img');
                    const descEl = article.querySelector('p, .description');

                    if (titleEl && linkEl) {
                        scrapedEvents.push({
                            title: titleEl.innerText.trim(),
                            description: descEl ? descEl.innerText.trim().substring(0, 200) : 'Event in Sydney',
                            sourceUrl: linkEl.href.startsWith('http') ? linkEl.href : `https://www.timeout.com${linkEl.href}`,
                            imageUrl: imgEl ? imgEl.src : 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
                            source: 'Time Out Sydney'
                        });
                    }
                });

                return scrapedEvents;
            });

            console.log(`✅ [TimeOut Sydney] Scraped ${events.length} events`);

            
            return events.map(event => ({
                title: event.title,
                date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within 30 days
                time: '7:00 PM',
                location: 'Sydney, Australia',
                venue: 'Various Venues',
                description: event.description,
                price: 'Check Website',
                category: this.categorizeEvent(event.title + ' ' + event.description),
                sourceUrl: event.sourceUrl,
                imageUrl: event.imageUrl,
                isActive: true
            }));

        } catch (error) {
            console.error('❌ [TimeOut Sydney] Scraping failed:', error.message);
            return [];
        } finally {
            if (browser) await browser.close();
        }
    }

    categorizeEvent(text) {
        const lower = text.toLowerCase();
        if (lower.includes('music') || lower.includes('concert') || lower.includes('jazz') || lower.includes('band')) return 'Music';
        if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dining') || lower.includes('festival')) return 'Food';
        if (lower.includes('tech') || lower.includes('startup') || lower.includes('innovation')) return 'Technology';
        if (lower.includes('sport') || lower.includes('cricket') || lower.includes('football') || lower.includes('rugby')) return 'Sports';
        if (lower.includes('art') || lower.includes('gallery') || lower.includes('exhibition') || lower.includes('theatre')) return 'Arts';
        return 'General';
    }
}

export default TimeOutSydneyScraper;
