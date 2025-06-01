import Manager from "../../models/staff.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Movies from "../../models/movieBooking.js";
import Fitness from "../../models/fitnessCenterBooking.js";
import PartyHall from "../../models/partyHallBooking.js";


export const managerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const findUser = await Manager.findOne({ email, role: "manager" });
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
      managerId: save._id,
    });
  } catch (error) {
    console.log("error in manager login", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};
