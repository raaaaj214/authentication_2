import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getMyInfo = async(req,res) =>{
    const {token} = req.cookies
    if(!token)
    {
     res.json({
         success : false,
         message : "You need to login first"
     })
    }
    const id = jwt.verify(token,process.env.SECRET_KEY)
    const userInfo = await User.findById(id)
 
     res.status(200).json({
         success : true,
         message : "Your info",
         userInfo
     })
 }

 export const registerUser = async(req,res) => {
    const {name , password} = req.body;
    const userInfo = await User.findOne({name})
    if(userInfo) 
    {
        res.json({
            success : false,
            message : "user already exist"
        })
    }
    else
    {
    const hashPassword =await  bcrypt.hash(password,10);
    User.create({name,password : hashPassword}).then(() => {
        console.log("Done")
    })
    res.json({
        success : true,
        message : "User created"
    })
}
}

export const loginUser = async(req,res) => {
    const {name , password} = req.body;
    const userInfo = await User.findOne({name});
    if(userInfo)
    {
        const result = await bcrypt.compare(password , userInfo.password)
        if(result === true)
        {
            const _id = userInfo._id
            const tokenValue = jwt.sign({_id},process.env.SECRET_KEY)
            res.cookie("token", tokenValue,{
                maxAge : 1000*60*60,
                sameSite: 'none', 
                secure: true
    })
    {
    res.json({
        success : true,
        message : "Logged In"
    })
}
}
else
{
    res.json({
        success : true,
        message : "password Incorrect"
    })
}
}
else
    {
        res.json({
            success : false,
            message : "User doesnt exist"
        })
    }
    
    
}

export const logoutUser = async(req,res) => {
    const {token} = req.cookies
    if(!token)
    {
        res.json({
            success : false,
            message : "ALready logged out"
        })
    }
    else
    {
        res.cookie("token" , null , {
            expires : new Date(Date.now())
        })
        res.json({
            success : true,
            message : "User logged out"
        })
    }
    
}