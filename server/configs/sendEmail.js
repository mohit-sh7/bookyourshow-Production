import resend from "./resend.js";

const sendEmail = async ({ to, subject, body }) => {
  const response = await resend.emails.send({
    from: "BookYourShow <onboarding@resend.dev>",
    to,
    subject,
    html: body,
  });

  return response;
};

export default sendEmail;