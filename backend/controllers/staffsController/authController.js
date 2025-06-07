import Staff from '../../models/staff.js'
import { sendOtp } from '../../utils/nodeMailer.js';
import bcrypt from 'bcrypt'

export const staffsSignUp = async (req, res) => {
      const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;
 if (!name || !email || !phone || !password || !confirmPassword  || !role) {
      return res.status(400).json({
        success: false,
        message: "Fill all the feilds before submission",
      });
    }
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords are not matched" });

    const staffExists = await Staff.findOne({ email, });
    if (staffExists)
      return res
        .status(400)
        .json({ success: false, message: "Staff already exists" });
    const otp = generateOTP();
    console.log("otp is: ", otp);

    const sentOtpToEmail = await sendOtp(email, otp);
    if (!sentOtpToEmail)
      return res
        .status(500)
        .json({ success: false, message: "Server error try later" });

    return res.status(200).json({
      success: true,
      message: "Please Check your email and enter the OTP",
      otp,
    });
  } catch (error) {
    console.log("error in signup Staff", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};


export const enterdOtpStaffSignUp = async (req, res) => {
  try {
    const { formData, code } = req.body;
    const { name, role, email, phone, password, confirmPassword } = formData;
    if(!code) return res.status(400).json({
        success: false,
        message: "please Enter the Otp",
      });
    if (!name || !role || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill all the feilds before submission",
      });
    }
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords are not matched" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const staffExists = await Staff.findOne({ email, });

    if (staffExists) {
      if (staffExists.isSignUpAccepted === false) {
        return res.status(400).json({
          success: false,
          message: "Please wait until admin approves your sign-up",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Staff already exists",
      });
    }

    const newStaff = new Staff({
     username: name,
      email,
      role,
      phone,
      password: hashedPassword,
      isSignUpAccepted:false,
    });

    const save =await newStaff.save();

    if (!save)
      return res
        .status(500)
        .json({ success: false, message: "Server error try later" });


    res.status(200).json({ success: true,});
  } catch (error) {
    console.log("error in enterdOtpStaffSignUp staff", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};
