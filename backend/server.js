import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import eventRoutes from './routes/events.js';
import scraperRoutes from './routes/scraper.js';
import chatRoutes from './routes/chat.js';
import cleanupRoutes from './routes/cleanup.js';
import './jobs/scheduledScraper.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Check your MongoDB Atlas Network Access settings (whitelist IP).');
    }
};

connectDB();


app.use('/api/events', eventRoutes);
app.use('/api/scrape', scraperRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cleanup', cleanupRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Sydney Events API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}`);
});
