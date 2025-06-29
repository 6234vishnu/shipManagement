import Manager from "../../models/staff.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const managerLogin = async (req, res) => {
  console.log(req.body);
  
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const findUser = await Manager.findOne({
      email,
      role: "manager",
      isSignUpAccepted: true,
    });
    if (!findUser)
      return res.status(400).json({
        success: false,
        message: "Couldint find manager please signUp",
      });
    const comparePassword = await bcrypt.compare(password, findUser?.password);
    if (!comparePassword)
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect try again" });

    const token = jwt.sign(
      { id: findUser._id, email: findUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("managerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      managerId: findUser._id,
    });
  } catch (error) {
    console.log("error in manager login", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};

export const managerLogout = async (req, res) => {
  try {
    const { managerId } = req.query;

    const findManager = await Manager.findById(managerId);
    if (!findManager)
      return res
        .status(400)
        .json({ success: false, message: "Couldint Logout try later" });

    res.clearCookie("managerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("error in manager logout", error);

    return res.status(500).json({
      success: false,
      message: "Logout successful",
    });
  }
};
