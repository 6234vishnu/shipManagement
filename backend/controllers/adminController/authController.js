import Admin from '../../models/staff.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body.data
        if(!email||!password)return res.status(400).json({success:false,message:"fill all the feilds before submission"})
      
            const findUser=await Admin.findOne({email})
            if(!findUser) return res.status(400).json({success:false,message:"fill all the feilds before submission"})
                const comparePassword=await bcrypt.compare(password,findUser?.password)
            if(!comparePassword) return res.status(400).json({success:false,message:"Password is incorrect try again"})

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
  
      res.status(200).json({ success: true, message: "Login successful", token ,id:save._id});
    } catch (error) {
        console.log('error in admin login',error);
        
        res.status(500).json({ success: true, message: "server error try later" });
    }
}