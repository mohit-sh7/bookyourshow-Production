import resend from "./resend.js";

const sendEmail = async ({ to, subject, body }) => {
  const response = await resend.emails.send({
    from: "BookYourShow <mohitallfamily1@gmail.com>",
    to,
    subject,
    html: body,
  });

  return response;
};

export default sendEmail;