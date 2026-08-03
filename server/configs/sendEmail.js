import apiInstance from "./brevo.js";

const sendEmail = async ({ to, subject, body }) => {
  try {
    const sendSmtpEmail = {
      sender: {
        name: "BookYourShow",
        email: process.env.SENDER_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: body,
    };

    const response = await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;