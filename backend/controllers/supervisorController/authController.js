import SuperVisor from '../../models/staff.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const supervisorLogin=async(req,res)=>{
   try {
       const { email, password } = req.body;
       if (!email || !password)
         return res.status(400).json({
           success: false,
           message: "fill all the feilds before submission",
         });
   
       const findUser = await SuperVisor.findOne({ email,role:'supervisor',isSignUpAccepted:true });
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
   
       res.cookie("supervisorToken", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000,
       });
   
       res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         supervisorId: save._id,
       });
     } catch (error) {
       console.log("error in supervisor Login ", error);
   
       return res
         .status(500)
         .json({ success: true, message: "server error try later" });
     }
}

