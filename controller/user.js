import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Post } from "../models/post.js";
import mongoose, { mongo } from "mongoose";
import { json } from "express";




export const getMyInfo = async(req,res) =>{
    try {
        const {token} = req.cookies

    const id = jwt.verify(token,process.env.SECRET_KEY)
    const {_id,name,email,followerList,followingList,followRequests} = await req.user
    const {myPosts, likedPosts} = await User.findById(_id).populate('myPosts likedPosts')
     res.status(200).json({
         success : true,
         message : "Your info",
         _id,
         name,
         email,
         followRequests,
         followerList,
         followingList,
         likedPosts,
         myPosts
         
     })
    } catch (error) {
        console.log(error)
    }
 }



 export const registerUser = async(req,res) => {
    try {
        const {name , password, email} = req.body;
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
    User.create({name,password : hashPassword, email}).then(() => {
        console.log("Done")
    })
    res.json({
        success : true,
        message : "User created"
    })
}
    } catch (error) {
        console.log(error)
    }  
}



export const loginUser = async(req,res) => {
    try {
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
                expires : new Date(2147483647000),
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
    
    } catch (error) {
        console.log(error)
    }   
}




export const logoutUser = async(req,res) => {
    try {
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
                expires : new Date(Date.now()),
                sameSite: process.env.MODE === 'development' ? 'lax' :  'none', 
                secure: process.env.MODE === 'development' ? false : true
            })
            res.json({
                success : true,
                message : "User logged out"
            })
        }
    } catch (error) {
        console.log(error)
    }

    
}



export const sendReq = async(req,res) =>{
    try {
        const {_id} = req.user
        
        await User.findByIdAndUpdate(req.params.id , {
            $push : {
                followRequests : {
                    userId : _id
                }
            }
        })
        const user = await User.findOne({_id : req.params.id}).populate("followRequests.userId", "name,_id").then(() => {console.log("please work")})
        res.status(200).json({
            success : true,
            message : "Request sent"
        })
    } catch (error) {
        console.log(error)
    }

}

export const getAllReq = async (req,res) =>{
    try {
        const userInfo = req.user
        console.log(userInfo)
        const requestList = userInfo.followRequests;
        console.log(requestList)
        res.status(200).json({
            success : true,
            requestList
        })
    } catch (error) {
        console.log(error)
    }

}

export const deleteReq = async(req,res) =>{
    try {
        const {id} = req.params
        const userInfo = req.user
        const reqList = userInfo.followRequests;
        reqList.filter((element, index , arr) => {
            const id1 = element._id.toString()
            const id2 = id.toString()
            console.log(id1, id2)
            if(id1 == id2)
            {
                reqList.splice(index, 1)
            }
        })
        await userInfo.save()
        console.log("final",reqList)
        res.status(200).json({
            success : true,
            message : "Req deleted succesfully",
            reqList,
            userInfo
        })
    } catch (error) {
        console.log(error)
    }
   
}

export const acceptReq = async (req,res,next) => {
    try {
        const id = req.params.id    //id is task id
        const userInfo = req.user;  //info of accepting user
    
        let exists;
        const {followRequests, followerList, _id, followingList} = userInfo   
        if(followRequests.length === 0)
        {
            exists = true
        }
        if(exists === true){
            res.json({
                success : false,
                message : "cannot accept req"
            })
            
        }
        else
        {
        let userRequest;
        followRequests.forEach(element => {
            const id1 = element._id.toString()
            const id2 = id.toString()
            if(id1 == id2)
            {
                userRequest = element
            }
        });
        if(userRequest)
        {
        const reqId = userRequest.userId
        console.log(await User.findById(reqId))
        await userInfo.followerList.push(reqId)
    
        const secondUserInfo = await User.findById(reqId)
        secondUserInfo.followingList.push(userInfo._id)
        await secondUserInfo.save();
        
        await userInfo.save();
        deleteReq(req,res);
        }
    }
    } catch (error) {
        console.log(error)
    }
   
}

export const isFollowed = async(req,res, next)=>{
    try {
        const {id} = req.params
        const {followerList} = req.user
        let isTrue = false;
        followerList.forEach(element => {
            const id1 = id.toString()
            const id2 = element.toString()
            if(id1 == id2)
            isTrue = true
        });
        if(isTrue === true)
        {
            res,json({
                success : true,
                message : "You can view posts"
            })
        }
        else
        {
            return res.json({
                success : false,
                message : "You need to follow the user in order to view post"
            })
        }
    } catch (error) {
          console.log(error)
    }

}

export const getFollowingList = async(req,res) =>{
    try {
        const {followingList} = await User.findById(req.user._id).populate('followingList')
        res.json({
            success : true,
            followingList
        })
    } catch (error) {
        console.log(error)
    }

}


export const getFollowerList = async(req,res) => {
    try {
        console.log(req.user)
        const {followerList} = await User.findById(req.user._id).populate('followerList' , 'name _id')
        res.json({
            success : true,
            followerList
    
        })
    } catch (error) {
        console.log(error)
    }

}

export const unFollow = async(req,res) => {
    try {
        const myInfo = req.user
        const {id} = req.params
        const userInfo = await User.findById(id)
        myInfo.followingList.filter((element, index , arr) => {
            const id1 = element.toString()
            const id2 = id.toString()
            console.log(id1, id2)
            if(id1 == id2)
            {
                myInfo.followingList.splice(index, 1)
            }
        })
        userInfo.followerList.filter((element, index , arr) => {
            const id1 = element.toString()
            const id2 = myInfo._id.toString()
            console.log(id1, id2)
            if(id1 == id2)
            {
                userInfo.followerList.splice(index, 1)
            }
        })
        await myInfo.save();
        await userInfo.save();
        res.json({
            success : true,
            message :"Unfollowed successfully"
        })
    } catch (error) {
        console.log(error)
    }

}