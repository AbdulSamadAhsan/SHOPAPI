const express = require('express');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/payment.html');
});

router.post('/submit', async (req, res) => {
    try {
        const { amount, product_name } = req.body;

        // Dynamic base URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',

                        product_data: {
                            name:  'My Product'
                        },

                        unit_amount: Math.round(Number(amount) * 100)
                    },

                    quantity: 1
                }
            ],

            mode: 'payment',

            success_url:
                `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                `${baseUrl}/payment/cancel`
        });

        console.log('Checkout Session ID:', session.id);

        res.redirect(303, session.url);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/success', async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).send('Session ID is required');
        }

        const session = await stripe.checkout.sessions.retrieve(
            session_id,
            {
                expand: [
                    'payment_intent',
                    'customer'
                ]
            }
        );

        const paymentIntent = session.payment_intent;

        console.log('FULL STRIPE SESSION');
        console.log(session);

        console.log('Session ID:', session.id);
        console.log('Payment Intent ID:', paymentIntent?.id);
        console.log('Payment Status:', session.payment_status);
        console.log('Amount:', session.amount_total / 100);
        console.log('Currency:', session.currency);
        console.log('Customer Email:', session.customer_details?.email);
        console.log('Customer Name:', session.customer_details?.name);

        res.json({
            success: true,

            checkout: {
                session_id: session.id,
                status: session.status,
                payment_status: session.payment_status
            },

            payment: {
                payment_intent_id: paymentIntent?.id,
                amount: session.amount_total / 100,
                currency: session.currency,
                payment_method: paymentIntent?.payment_method,
                created: paymentIntent?.created
            },

            customer: {
                id: session.customer?.id || null,
                name: session.customer_details?.name || null,
                email: session.customer_details?.email || null,
                phone: session.customer_details?.phone || null
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/cancel', (req, res) => {
    res.send('Payment cancelled');
});

module.exports = router;