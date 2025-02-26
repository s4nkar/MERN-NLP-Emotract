import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587, // Change to 465 if using `secure: true`
    secure: false, // false for 587 (STARTTLS), true for 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });

export const sendResetEmail = async (email, token) => {
  try {
    await transporter.sendMail({
      from: `"Emotract V1" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password/${token}">here</a> to reset your password.</p>`,
    });

    console.log("Password reset email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email not sent");
  }
};
