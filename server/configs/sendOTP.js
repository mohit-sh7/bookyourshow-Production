import sendEmail from "./nodeMailer.js";

const sendOTP = async (email, otp) => {
    await sendEmail({
        to: email,
        subject: "Email Verification",
        body: `
            <div style="font-family:Arial,sans-serif;">
                <h2>Email verification</h2>

                <p>Your verification code is:</p>

                <h1>${otp}</h1>

                <p>This code expires in 10 minutes.</p>
            </div>
        `,
    });
};

export default sendOTP;