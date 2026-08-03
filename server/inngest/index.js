import { inngest } from "./client.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "../configs/nodeMailer.js";

// -----------------------------------------------------
// 1. Cancel booking after 10 minutes if unpaid
// -----------------------------------------------------

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    try {
      const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

      await step.sleepUntil(
        "wait-for-10-minutes",
        tenMinutesLater
      );

      const booking = await Booking.findById(event.data.bookingId);

      if (!booking || booking.isPaid) {
        return;
      }

      const show = await Show.findById(booking.show);

      if (!show) {
        return;
      }

      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat];
      });

      show.markModified("occupiedSeats");

      await show.save();
      await Booking.findByIdAndDelete(booking._id);

      console.log("Booking deleted successfully.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// -----------------------------------------------------
// 2. Send booking confirmation email
// -----------------------------------------------------

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event }) => {
    try {
      console.log("Starting booking confirmation email.");

      const booking = await Booking.findById(event.data.bookingId)
        .populate({
          path: "show",
          populate: {
            path: "movie",
            model: "Movie",
          },
        });

      if (!booking) {
        throw new Error("Booking not found.");
      }

      const user = await User.findById(booking.user);

      if (!user) {
        throw new Error("User not found.");
      }

      await sendEmail({
        to: user.email,
        subject: "Booking Confirmed 🎉",
        body: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Your booking has been confirmed!</h2>

            <p>
              Thank you for choosing QuickShow.
            </p>

            <p>
              <strong>Movie:</strong>
              ${booking.show.movie.title}
            </p>

            <p>
              <strong>Seats:</strong>
              ${booking.bookedSeats.join(", ")}
            </p>

            <p>
              <strong>Amount:</strong>
              ₹${booking.amount}
            </p>

            <p>
              Enjoy your movie!
            </p>
          </div>
        `,
      });

      console.log("Booking confirmation email sent.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// -----------------------------------------------------
// 3. Notify users when a new show is added
// -----------------------------------------------------

const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },
  async ({ event }) => {
    try {
      const users = await User.find({});

      for (const user of users) {
        await sendEmail({
          to: user.email,
          subject: "New Show Added 🎬",
          body: `
            <div style="font-family: Arial, sans-serif;">
              <h2>A new show has been added!</h2>

              <p>
                ${event.data.movieTitle}
              </p>

              <p>
                Book your tickets now.
              </p>
            </div>
          `,
        });
      }

      console.log("Notifications sent.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// -----------------------------------------------------

export const functions = [
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendNewShowNotifications,
];

export { inngest };