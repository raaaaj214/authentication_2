import mongoose, { Schema, mongo } from "mongoose";


const postSchema = new Schema({
    description : {
        type : String,
        required : true,
        maxLength : [250 , "You can type upto only 250 characters"]
    },
    img : {type  : String},
    date : {
        type : Date,
        default : new Date(Date.now()),
        required : true
    },
    user : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    likeCount : {
        type : Number,
        required : true,
        default : 0

    }, 
    comments : {type : [{
        text : String,
        postedBy :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }  
    }],
    default : []
    }
})

export const Post = mongoose.model("Post",postSchema)