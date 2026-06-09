import nodemailer from "nodemailer";

const hasEmailConfig = () =>
  Boolean(process.env.HOST_EMAIL && process.env.HOST_PASS);

let transporter = null;

const getTransporter = () => {
  if (!hasEmailConfig()) {
    console.warn("⚠️ Email service is not configured. Missing HOST_EMAIL or HOST_PASS");
    return null;
  }
  
  if (transporter) return transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASS,
      },
    });
    console.log("✅ Email transporter initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize email transporter:", error.message);
    transporter = null;
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailer = getTransporter();
  if (!mailer) {
    const errorMsg = "Email service is not configured. Please set HOST_EMAIL and HOST_PASS environment variables";
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
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
