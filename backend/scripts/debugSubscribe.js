import axios from 'axios';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const testSubscribe = async () => {
    try {
        console.log('Connecting to DB to fetch an event...');
        await mongoose.connect(process.env.MONGODB_URI);

        const event = await Event.findOne({ isActive: true });
        if (!event) {
            console.log('No active events found to test with.');
            process.exit(1);
        }

        console.log(`Found event: ${event.title} (ID: ${event._id})`);

        // Use the configured email or a fallback
        const email = process.env.EMAIL_USER;
        const url = `http://localhost:${process.env.PORT || 5001}/api/events/${event._id}/subscribe`;

        console.log(`Sending POST request to ${url}...`);
        console.log(`Payload: { email: '${email}' }`);

        const res = await axios.post(url, { email });

        console.log('Response Status:', res.status);
        console.log('Response Data:', res.data);

    } catch (error) {
        console.error('Test Failed!');
        if (error.response) {
            console.error('Server responded with:', error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
    } finally {
        await mongoose.disconnect();
    }
};

testSubscribe();
