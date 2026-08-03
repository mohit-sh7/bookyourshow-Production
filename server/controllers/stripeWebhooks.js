import Stripe from "stripe";
import Booking from "../models/Booking.js";
import QRCode from "qrcode";
import { sendBookingMail } from "../configs/sendBookingMail.js";
import cloudinary from "../configs/cloudinary.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  console.log("Stripe webhook endpoint reached");

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Payment completed.");

        const session = event.data.object;

        const bookingId = session.metadata?.bookingId;

        console.log("Booking ID:", bookingId);

        if (!bookingId) {
          return res.status(400).json({
            success: false,
            message: "Booking ID not found.",
          });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
          console.log("Booking not found.");

          return res.status(404).json({
            success: false,
            message: "Booking not found.",
          });
        }

        // Prevent duplicate webhook execution
        if (booking.isPaid) {
          console.log("Booking already paid.");

          return res.json({
            received: true,
          });
        }

        const verifyUrl = `${process.env.FRONTEND_URL}/verify/${booking._id}`;

       const qrCode = await QRCode.toDataURL(verifyUrl);

const uploaded = await cloudinary.uploader.upload(qrCode, {
    folder: "bookyourshow/qr",
});

booking.qrCode = uploaded.secure_url;
        booking.isPaid = true;
        booking.paymentLink = "";

        await booking.save();

        console.log("Booking updated successfully.");

        try {
  await sendBookingMail(bookingId);
} catch (error) {
  console.error(error);
}
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};