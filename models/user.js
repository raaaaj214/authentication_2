import mongoose, { Mongoose, mongo } from "mongoose";
import { Schema } from "mongoose";


const userSchema =  new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    followingList : [
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "User" , 
            unique : true
        }
    ],
    followerList : [{type : mongoose.Schema.Types.ObjectId , ref : "User", unique : true}],

    followRequests : {type : [{
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        isAccepted : {type : Boolean , default : false}
    }],
    default : []
    },
    likedPosts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    myPosts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }]
})

export const User = mongoose.model('User',userSchema)