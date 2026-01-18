import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Testing Email Credentials...');
console.log('User:', process.env.EMAIL_USER);
// Mask password for security in logs
console.log('Password length:', process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendTest = async () => {
    try {
        console.log('Attempting to send mail...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from EventPulse Debugger',
            text: 'If you see this, your credentials are correct!'
        });
        console.log('✅ Success! Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Failed!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        if (error.response) console.error('SMTP Response:', error.response);
    }
};

sendTest();
