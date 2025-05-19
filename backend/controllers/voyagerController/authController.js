import Voyager from "../../models/voyager.js";
import { sendOtp } from "../../utils/nodeMailer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };


  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill all the feilds before submission",
      });
    }
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords are not matched" });

    const userExists = await Voyager.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
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
    console.log("error in signup voyager", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};

export const enterdOtp = async (req, res) => {
  try {
    const { formData, code } = req.body;
    const { name, email, phone, password, confirmPassword } = formData;
    if(!code) return res.status(400).json({
        success: false,
        message: "please Enter the Otp",
      });
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill all the feilds before submission",
      });
    }
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords are not matched" });

    const userExists = await Voyager.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVoyager = new Voyager({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const save = newVoyager.save();

    if (!save)
      return res
        .status(500)
        .json({ success: false, message: "Server error try later" });

    const token = jwt.sign(
      { id: save._id, email: save.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("voyagerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, message: "sign up successful", token ,id:save._id});
  } catch (error) {
    console.log("error in enterdOtp voyager", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};
