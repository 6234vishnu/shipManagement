import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendSignupStatusEmail = async (email, name, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isApproved = status.toLowerCase() === 'approved';

    const subject = `Signup Request ${isApproved ? 'Approved' : 'Rejected'} - Horizon Cruiser`;

    const htmlContent = `
      <p>Dear ${name},</p>
      <p>Your signup request for <strong>Horizon Cruiser</strong> has been <strong>${isApproved ? 'approved' : 'rejected'} by the Admin</strong>.</p>
      ${
        isApproved
          ? '<p>You can now log in and start using your account.</p>'
          : '<p>If you believe this was a mistake, please contact support for further assistance.</p>'
      }
      <br/>
      <p>Thank you,<br/>Horizon Cruiser Team</p>
    `;

    await transporter.sendMail({
      from: `"Horizon Cruiser" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    console.error('Error sending signup status email:', err);
    return false;
  }
};
