import HeadCook from "../../models/staff.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const headCookLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const findUser = await HeadCook.findOne({
      email,
      role: "head-cook",
      isSignUpAccepted: true,
    });
    if (!findUser)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
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

    res.cookie("headCookToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      headCookId: save._id,
    });
  } catch (error) {
    console.log("error in headCook Login", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const headCookLogout = async (req, res) => {
  try {
    const { headCookId } = req.query;

    const findHeadCook = await HeadCook.findById(headCookId);
    if (!findHeadCook)
      return res
        .status(400)
        .json({ success: false, message: "Couldint Logout try later" });

    res.clearCookie("headCookToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("error in headCook logout", error);

    return res.status(500).json({
      success: false,
      message: "Logout successful",
    });
  }
};
