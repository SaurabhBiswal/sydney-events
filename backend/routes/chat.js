import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        const lowerMsg = message.toLowerCase();

        const lastBotMessage = history && history.length > 0
            ? history.filter(m => !m.isUser).pop()?.text
            : "";

        
        if (lastBotMessage && lastBotMessage.includes("Would you like a link") && (lowerMsg === 'yes' || lowerMsg.includes('sure') || lowerMsg.includes('link'))) {
           

            const events = await Event.find({
                isActive: true,
                date: { $gte: new Date() } 
            }).sort({ date: 1 }).limit(3);

            const links = events.map(e => `🔗 [${e.title}](${e.sourceUrl})`).join('\n');

            return res.json({
                success: true,
                response: `Great! Here are the booking links for the upcoming events:\n\n${links}\n\nClick them to book directly!`
            });
        }

       
        let query = {
            isActive: true,
            date: { $gte: new Date() } 
        };

        let responseText = "";

        if (lowerMsg.includes('music') || lowerMsg.includes('concert') || lowerMsg.includes('jazz')) {
            query.category = 'Music';
            responseText = "🎵 I found these upcoming music events for you:";
        } else if (lowerMsg.includes('food') || lowerMsg.includes('dinner') || lowerMsg.includes('lunch')) {
            query.category = 'Food';
            responseText = "🍔 Here are some food events coming up:";
        } else if (lowerMsg.includes('tech') || lowerMsg.includes('startup') || lowerMsg.includes('coding')) {
            query.category = 'Technology';
            responseText = "💻 Check out these upcoming tech events:";
        } else if (lowerMsg.includes('sports') || lowerMsg.includes('cricket') || lowerMsg.includes('football')) {
            query.category = 'Sports';
            responseText = "⚽ Here are the sports events:";
        } else {
            responseText = "Here are the events happening next in Sydney:";
        }

        
        const events = await Event.find(query).sort({ date: 1 }).limit(3);

        
        if (events.length === 0) {
            return res.json({
                success: true,
                response: `I currently don't see any upcoming ${query.category || ''} events in my database for the next few months. \n\nHowever, our scraper updates daily! Check back soon.`,
                data: []
            });
        }

        
        const eventList = events.map(e => {
            const dateStr = new Date(e.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
            return `• ${e.title}\n  📅 ${dateStr} @ ${e.venue} (${e.price})`;
        }).join('\n\n');

        const finalResponse = `${responseText}\n\n${eventList}\n\nWould you like a link to any of these? (Type 'Yes')`;

        res.json({
            success: true,
            response: finalResponse,
            data: events
        });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process chat message' });
    }
});

export default router;
