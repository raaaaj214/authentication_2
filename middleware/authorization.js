import express from "express"
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const authorization = async(req,res,next) =>{
    const {token} = req.cookies
    console.log(req.cookies)
    if(!token)
    {
        res.status(200).json({
            success : false,
            message : "AUthorization failure"
        })
    }
    else
    {
    const id =  jwt.verify(token,process.env.SECRET_KEY)
    req.user = await User.findById(id)
    next();
    }
}