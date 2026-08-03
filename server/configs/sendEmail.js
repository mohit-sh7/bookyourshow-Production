const sendEmail = async ({ to, subject, body }) => {
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "BookYourShow",
            email: process.env.SENDER_EMAIL,
          },
          to: [{ email: to }],
          subject,
          htmlContent: body,
        }),
      }
    );

    const data = await response.json();

    console.log("Brevo response:", data);

    return data;
  } catch (error) {
    console.error("Brevo error:", error);
  }
};

export default sendEmail;