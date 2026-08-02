import stripe from "stripe";
import Booking from '../models/Booking.js'
import { inngest } from "../inngest/index.js";
import QRCode from "qrcode";

export const stripeWebhooks = async (request, response)=>{
    console.log("Stripe webhook endpoint reached");
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
    case "checkout.session.completed": {
        const session = event.data.object;

     const { bookingId } = session.metadata;

const booking = await Booking.findById(bookingId).populate({
    path: "show",
    populate: {
        path: "movie",
    },
});

const verifyUrl = `${process.env.FRONTEND_URL}/verify/${booking._id}`;

const qrCode = await QRCode.toDataURL(verifyUrl);

booking.qrCode = qrCode;
booking.isPaid = true;
booking.paymentLink = "";

await booking.save();

await inngest.send({
    name: "app/show.booked",
    data: { bookingId },
});

break;
            }
        
            default:
                console.log('Unhandled event type:', event.type)
        }
        response.json({received: true})
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
}
