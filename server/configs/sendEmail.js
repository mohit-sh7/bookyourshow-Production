import resend from "./resend.js";

const sendEmail = async ({ to, subject, body }) => {
  try {
    console.log("sendEmail() called");
    console.log("Recipient:", to);

    const response = await resend.emails.send({
      from: "BookYourShow <onboarding@resend.dev>",
      to,
      subject,
      html: body,
    });

    console.log("Resend response:", response);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;