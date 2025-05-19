import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendOtp = async (email, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

   
    const info = await transporter.sendMail({
      from: `"Tata Motors" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Horizon Cruiser Signup',
      html: `<p>Your OTP for Horizon Cruiser signup is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });

 
    return true;
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return false;
  }
};
