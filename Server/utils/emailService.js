import nodemailer from "nodemailer";

const hasEmailConfig = () =>
  Boolean(process.env.HOST_EMAIL && process.env.HOST_PASS);

let transporter = null;

const getTransporter = () => {
  if (!hasEmailConfig()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailer = getTransporter();
  if (!mailer) {
    throw new Error("Email service is not configured");
  }

  await mailer.sendMail({
    from: process.env.HOST_EMAIL,
    to,
    subject,
    html,
  });
};
