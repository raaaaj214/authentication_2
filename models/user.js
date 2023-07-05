import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema =  new Schema({
    name : {
        type : String,
    },
    password : String
})

export const User = mongoose.model("User",userSchema)