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

export const voyagerLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const findUser = await Voyager.findOne({ email });

    if (!findUser)
      return res
        .status(400)
        .json({
          success: false,
          message: "couldint find User with this email",
        });

    const hashedPassword = await bcrypt.compare(password, findUser?.password);

    if (!hashedPassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: findUser?._id, email: findUser?.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("voyagerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        voyagerId: findUser?._id,
      });
  } catch (error) {
    console.log("error in voyagerLogin ", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};

export const getVoyagerDetails = async (req, res) => {
  try {
    const { voyagerId } = req.query;

    const findVoyagerDeatails = await Voyager.findById(voyagerId);
    if (!findVoyagerDeatails) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      voyager: findVoyagerDeatails,
    });
  } catch (error) {
    console.log("error in getVoyagerDetails", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
};

export const enterdOtp = async (req, res) => {
  try {
    const { formData, code } = req.body;
    const { name, email, phone, password, confirmPassword } = formData;
    if (!code)
      return res.status(400).json({
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

    const save = await newVoyager.save();

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

    res
      .status(200)
      .json({
        success: true,
        message: "sign up successful",
        token,
        voyagerId: save?._id,
      });
  } catch (error) {
    console.log("error in enterdOtp voyager", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};

export const voyagerLogout = async (req, res) => {
  try {
    const { voyagerId } = req.query;
    const findVoyager = await Voyager.findById(voyagerId);
    if (!findVoyager)
      return res
        .status(400)
        .json({ success: false, message: "Couldint logout please try leter" });

    res.clearCookie("voyagerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("error in Voyager logout", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
};

export const forgotPasswordGetOtp = async (req, res) => {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Please enter your email" });
    const findUser = await Voyager.findOne({ email });
    if (!findUser)
      return res
        .status(400)
        .json({
          success: false,
          message: "Couldint find any user in this email",
        });

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
      id: findUser._id,
    });
  } catch (error) {
    console.log("error in voyager forgotPasswordHetOtp", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
};

export const saveNewPassword = async (req, res) => {
  try {
    const { password, voyagerId } = req.body;
    if (!password || !voyagerId)
      return res
        .status(500)
        .json({ success: false, message: "Server error, try later" });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword)
      return res
        .status(500)
        .json({ success: false, message: "Server error, try later" });
    const findUser = await Voyager.findById(voyagerId);
    if (!findUser)
      return res
        .status(400)
        .json({ success: false, message: "Couldint find user try later" });

    const updatePassword = await Voyager.findByIdAndUpdate(
      voyagerId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatePassword)
      return res
        .status(500)
        .json({
          success: false,
          message: "Couldint Update password try later",
        });

    const token = jwt.sign(
      { id: findUser._id, email: findUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("voyagerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({
        success: true,
        voyagerId: findUser._id,
        message: "Password successfully updated",
      });
  } catch (error) {
    console.log("error in voyager saveNewPassword", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
};
