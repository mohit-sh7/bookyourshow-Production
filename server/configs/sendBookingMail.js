import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "./nodeMailer.js";

export const sendBookingMail = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    const user = await User.findById(booking.user);

    const show = await Show.findById(booking.show).populate("movie");

    if (!user || !show) {
      throw new Error("User or show not found");
    }

    const movie = show.movie;

    await sendEmail({
  to: user.email,
  subject: `Booking confirmed - ${movie.title}`,
  body: `
    <div style="font-family:Arial,sans-serif;padding:20px;">

      <h1>Your booking is confirmed 🎉</h1>

      <h2>${movie.title}</h2>

      <img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        alt="${movie.title}"
        style="width:220px;border-radius:10px;"
      />

      <hr />

      <p><strong>Booking ID:</strong> ${booking._id}</p>

      <p><strong>Seats:</strong>
      ${booking.bookedSeats.join(", ")}</p>

      <p><strong>Total amount:</strong>
      ₹${booking.amount}</p>

      <p><strong>Language:</strong>
      ${movie.original_language}</p>

      <p><strong>Runtime:</strong>
      ${movie.runtime} minutes</p>

      <hr />

      <h3>Your QR code</h3>

      <img
        src="${booking.qrCode}"
        alt="QR code"
        style="width:250px;"
      />

      <p>Please show this QR code at the entrance.</p>

    </div>
  `,
});

    console.log("Booking confirmation email sent.");
  } catch (error) {
    console.error("Email error:", error);
  }
};