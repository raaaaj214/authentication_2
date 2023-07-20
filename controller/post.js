import { Post } from "../models/post.js"
import {v2 as cloudinary} from "cloudinary"
import { User } from "../models/user.js"

export const gerAllPosts = async(req,res) => {
    try {
        const posts = await Post.find().populate('user', 'name _id')
        res.status(200).json({
            success : true,
            posts
        })
    } catch (error) {
        console.log(error)
    }

}


export const uploadPost = async(req,res) =>{
  try {
    const {description} = req.body;
    const {id} = req.user
    const userInfo = await User.findById(id)
    if(req.file) 
    {
    console.log(req.file)
    const result = await cloudinary.uploader
      .upload(req.file.path)
    const newPost = await Post.create({description, user : id, 
    img : result.secure_url
    })
    newPost.save(); 
    
    }
    else
    {

    const newPost = new Post({
        description,
        user : id,
        img : null
    })
    
    newPost.populate('user' , 'name _id')
     newPost.save();
    userInfo.myPosts.push(newPost._id)
    userInfo.save()

    }
    res.json({
        success : true,
        message : "Post uploaded",
    })
  } catch (error) {
    console.log(error)
  }
 }


export const getAllUserPosts = async(req,res) => {
    try {
        const {id} = req.params
        const userPosts = await Post.find({user : id}).populate("user","name  _id")
        res.status(200).json(
            {
                userPosts
            }
        )
    } catch (error) {
        console.log(error)
    }

}

export const postLiked = async(req,res)=>{
    try {
        const {id} = req.params
        const postInfo =await Post.findById(id)
        const userInfo = await User.findById(req.user._id)
        const AlreadyLikedPost = await User.find({
            _id : req.user.id,
            likedPosts  : id
        })
        console.log(AlreadyLikedPost)
        if(postInfo === null || undefined)
        {
            return res.json({
                message : "Post doesnt exist"
            })
        }
        if(AlreadyLikedPost.length != 0)
        {
            postInfo.likeCount = postInfo.likeCount - 1 ; 
            postInfo.save();
            await User.updateOne({
                _id : req.user._id
            },{
                $pull : {
                    likedPosts : id
                }
            })
            res.json({
                message : "post disliked"
            })
        }
        else
        {
            postInfo.likeCount = postInfo.likeCount + 1;
            postInfo.save();
            console.log(userInfo)
            userInfo.likedPosts.push(id)
            userInfo.populate('likedPosts', 'description likeCount')
            userInfo.save()
            res.json({
                message : "Post liked"
            })
        }
    } catch (error) {
        console.log(error)
    }

}

export const deletePost = async(req,res) =>{
    try {
        await Post.deleteOne({_id : req.params.id});
        res.status(200).json({
            success : true,
            message : "Post deleted successfully"
        }) 
    } catch (error) {
        console.log(error)
    }

}

export const commentOnPost = async (req,res) =>{
    try {
        const {text} = req.body
        const {_id} = req.user
        console.log(text)
        try {
            await Post.findByIdAndUpdate(req.params.id , {
                $push : {comments : {
                    text,postedBy : _id
                }}
            },{
                new : true
            } )
        
            res.status(200).json({
                success  :true,
                message :"commented on the post",
            })
        
        
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }

}


export const getComments = async (req,res) => {
    try {
        const {id} = req.params
        const {comments} = await Post.findById(id).populate('comments.postedBy','name _id')
        res.json({
            success : true,
            comments
        })
    } catch (error) {
        console.log(error)
    }

}