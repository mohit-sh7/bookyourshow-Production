import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "./sendEmail.js";

export const sendBookingMail = async (bookingId) => {
  try {
    console.log("Booking mail function called");

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

    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    await sendEmail({
      to: user.email,
      subject: `Booking confirmed - ${movie.title}`,
      body: `
      <div style="background:#0f172a;padding:40px;font-family:Arial,sans-serif;color:white;">

        <div style="
            max-width:650px;
            margin:auto;
            background:#111827;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #374151;
        ">

            <img
                src="${posterUrl}"
                alt="${movie.title}"
                style="
                    width:100%;
                    height:280px;
                    object-fit:cover;
                "
            />

            <div style="padding:25px;">

                <h1>${movie.title}</h1>

                <p style="color:#9ca3af;">
                    Your booking has been confirmed 🎉
                </p>

                <hr />

                <p><b>Booking ID:</b> ${booking._id}</p>

                <p><b>Seats:</b> ${booking.bookedSeats.join(", ")}</p>

                <p><b>Amount:</b> ₹${booking.amount}</p>

                <p><b>Language:</b> ${movie.original_language}</p>

                <p><b>Duration:</b> ${movie.runtime} min</p>

                <hr />

                <div style="text-align:center;">

                    <h2>Your Ticket QR Code</h2>

                    <img
                        src="${booking.qrCode}"
                        alt="QR Code"
                        style="
                            width:220px;
                            border-radius:12px;
                        "
                    />

                    <p style="margin-top:15px;">
                        Please show this QR code at the entrance.
                    </p>

                </div>

            </div>

        </div>

      </div>
      `,
    });

    console.log("Booking confirmation email sent.");
  } catch (error) {
    console.error("Email error:", error);
  }
};