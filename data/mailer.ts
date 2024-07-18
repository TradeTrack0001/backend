import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., Gmail service
  auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
  }
});

export default transporter;
