import { inngest } from "./client.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "../configs/nodeMailer.js";


// 1. Cancel booking after 10 mins if unpaid
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    const booking = await Booking.findById(event.data.bookingId);

    if (!booking || booking.isPaid) return;

    const show = await Show.findById(booking.show);

    Object.keys(booking.bookedSeats).forEach((seat) => {
      delete show.occupiedSeats[seat];
    });

    show.markModified("occupiedSeats");
    await show.save();

    await Booking.findByIdAndDelete(booking._id);
  }
);


// 2. Send booking confirmation email
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event }) => {
    const booking = await Booking.findById(event.data.bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Your booking is confirmed`,
      body: `Your movie ${booking.show.movie.title} is confirmed.`,
    });
  }
);


// 3. New show notifications
const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },
  async ({ event }) => {
    const users = await User.find({});

    for (let user of users) {
      await sendEmail({
        to: user.email,
        subject: `New Show Added`,
        body: `New show: ${event.data.movieTitle}`,
      });
    }
  }
);


export const functions = [
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendNewShowNotifications,
];

export { inngest };