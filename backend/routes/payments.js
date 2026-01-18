import express from 'express';
import Stripe from 'stripe';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe only if key is present to prevent startup crashes
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY not found. Payment routes will not work.');
}

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                success: false,
                error: 'Payment service not configured (Missing Stripe API Key)'
            });
        }

        const { eventId, quantity = 1 } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Parse price (assuming string like "$20" or just number)
        let price = 0;
        if (typeof event.price === 'string') {
            price = parseFloat(event.price.replace(/[^0-9.]/g, ''));
        } else {
            price = event.price;
        }

        if (!price || price <= 0) {
            return res.status(400).json({ success: false, error: 'Event is free or price invalid' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: event.title,
                            description: `${event.date} at ${event.venue}`,
                            images: event.imageUrl ? [event.imageUrl] : [],
                        },
                        unit_amount: Math.round(price * 100), // Amount in cents
                    },
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/profile?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/?payment=cancelled`,
            metadata: {
                eventId: event._id.toString(),
                userId: req.user.id.toString(),
            },
            customer_email: req.user.email,
        });

        res.json({ success: true, id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
