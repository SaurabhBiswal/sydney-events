import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { sendReminderEmail } from '../services/emailService.js';


// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('Running reminder check job...');

    try {
        const now = new Date();
        const pendingReminders = await Reminder.find({
            sent: false,
            reminderTime: { $lte: now }
        }).populate('userId').populate('eventId');

        console.log(`Found ${pendingReminders.length} pending reminders.`);

        for (const reminder of pendingReminders) {
            const { userId: user, eventId: event } = reminder;

            if (!user || !event) {
                console.log(`Invalid reminder ${reminder._id} - missing user or event`);
                reminder.sent = true; // Mark as sent to avoid repeated failures
                await reminder.save();
                continue;
            }

            // Check user preferences
            if (!user.notificationSettings?.eventReminders) {
                console.log(`User ${user.email} has disabled reminders. Skipping.`);
                reminder.sent = true;
                await reminder.save();
                continue;
            }

            // Send Email
            if (user.notificationSettings.email) {
                await sendReminderEmail(user, event);
                console.log(`Sent email reminder to ${user.email}`);
            }

            // Send Telegram
            // Note: Use telegram only if we have stored chatId (not implemented yet in User model, but good for future)
            // For now, skipping direct telegram DM unless we map email to chatId or user linked telegram

            reminder.sent = true;
            await reminder.save();
        }

    } catch (error) {
        console.error('Error in reminder job:', error);
    }
});
