// import nodemailer from "nodemailer";

// const hasEmailConfig = () =>
//   Boolean(process.env.HOST_EMAIL && process.env.HOST_PASS);

// let transporter = null;

// const getTransporter = async () => {
//   if (!hasEmailConfig()) {
//     const errorMsg =
//       "Email service is not configured. Missing HOST_EMAIL or HOST_PASS";
//     console.warn(`⚠️ ${errorMsg}`);
//     throw new Error(errorMsg);
//   }

//   if (transporter) return transporter;

//   try {
//     transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.HOST_EMAIL,
//         pass: process.env.HOST_PASS,
//       },
//     });

//     console.log("HOST_EMAIL:", process.env.HOST_EMAIL);
//     console.log("HOST_PASS exists:", !!process.env.HOST_PASS);

//     // await transporter.verify();
//     console.log("✅ Email transporter initialized successfully");
//   } catch (error) {
//     console.error("❌ Failed to initialize email transporter:", error.message);
//     transporter = null;
//     throw error;
//   }

//   return transporter;
// };

// export const sendEmail = async ({ to, subject, html }) => {
//   let mailer;
//   try {
//     mailer = await getTransporter();
//   } catch (error) {
//     const errorMsg =
//       "Email service is not configured or failed to connect. Please set HOST_EMAIL and HOST_PASS correctly.";
//     console.error(`❌ ${errorMsg}`, error.message);
//     throw new Error(error.message || errorMsg);
//   }

//   try {
//     await mailer.sendMail({
//       from: process.env.HOST_EMAIL,
//       to,
//       subject,
//       html,
//     });
//     console.log(`✅ Email sent successfully to ${to}`);
//   } catch (error) {
//     console.error(`❌ Failed to send email to ${to}:`, error.message);
//     throw error;
//   }
// };


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", response);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};
