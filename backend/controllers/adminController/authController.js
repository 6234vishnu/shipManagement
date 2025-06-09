
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/staff.js";
import { sendSignupStatusEmail } from "../../utils/StaffLoginRequestMailer.js";
import staff from "../../models/staff.js";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const findUser = await Admin.findOne({ email, role: "admin" });
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

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      id: findUser._id,
    });
  } catch (error) {
    console.log("error in admin login", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};

export const getstaffsUnApproved = async (req, res) => {
  try {
    const getUnApprovedRequests = await Admin.find({ isSignUpAccepted: false });
    if (!getUnApprovedRequests)
      return res
        .status(400)
        .json({ success: false, message: "No new Request to Approve" });

 
    return res
      .status(200)
      .json({ success: true, requests: getUnApprovedRequests });
  } catch (error) {
    console.log("error in getstaffsUnApproved", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};

export const getadminDetails = async (req, res) => {
  try {
    const { adminId } = req.query;

    const findAdminDeatails = await Admin.findById(adminId);
    if (!findAdminDeatails) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({
      success: true,
      admin: findAdminDeatails,
    });
  } catch (error) {
    console.log("error in getadminDetails", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
};


export const adminLogout = async (req, res) => {
try {
  const {adminId}=req.query
  const findAdmin=await Admin.findById(adminId)
  if(!findAdmin)
     return res
        .status(400)
        .json({ success: false, message: "Couldint logout please try leter" });

   res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });      

} catch (error) {
     console.log("error in adminLogout", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
}
}

export const approveStaffRequest=async (req,res)=>{
  try {
    const {staffId}=req.query

    const findStaff=await Admin.findByIdAndUpdate(staffId,{$set:{isSignUpAccepted:true}})

    if(!findStaff)
      return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
     const status='approved'
    await sendSignupStatusEmail(findStaff?.email,findStaff?.username,status)

      return res.status(200).json({
      success: true,
      message: "Successfully accepted SignUp",
    });      

  } catch (error) {
      console.log("error in approveStaffRequest", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
}


export const rejectStaffRequest=async (req,res)=>{
  try {
    const {staffId}=req.query

    const findStaffAndReject=await Admin.findByIdAndDelete(staffId)

    if(!findStaffAndReject)
      return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
     const status='rejected'
    await sendSignupStatusEmail(findStaffAndReject?.email,findStaffAndReject?.username,status)

      return res.status(200).json({
      success: true,
      message: "Successfully rejected SignUp",
    });      

  } catch (error) {
      console.log("error in rejectStaffRequest", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error, try later" });
  }
}