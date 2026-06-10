import nodemailer from "nodemailer";

const hasEmailConfig = () =>
  Boolean(process.env.HOST_EMAIL && process.env.HOST_PASS);

let transporter = null;

const getTransporter = async () => {
  if (!hasEmailConfig()) {
    const errorMsg = "Email service is not configured. Missing HOST_EMAIL or HOST_PASS";
    console.warn(`⚠️ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (transporter) return transporter;

  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("✅ Email transporter initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize email transporter:", error.message);
    transporter = null;
    throw error;
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  let mailer;
  try {
    mailer = await getTransporter();
  } catch (error) {
    const errorMsg = "Email service is not configured or failed to connect. Please set HOST_EMAIL and HOST_PASS correctly.";
    console.error(`❌ ${errorMsg}`, error.message);
    throw new Error(error.message || errorMsg);
  }

  try {
    await mailer.sendMail({
      from: process.env.HOST_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};
