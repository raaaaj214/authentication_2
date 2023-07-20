import express from "express"
import { acceptReq, deleteReq, getAllReq, getFollowerList, getFollowingList, getMyInfo, loginUser, logoutUser, registerUser, sendReq, unFollow} from "../controller/user.js";
import { getAllUserPosts, uploadPost } from "../controller/post.js";
import { authorization } from "../middleware/authorization.js";
import { User } from "../models/user.js";
import { isFollowed } from "../middleware/isFollowed.js"
import cloudinary from "../middleware/cloudinary.js";
import { uploader } from "../middleware/multer.js";
import { Post } from "../models/post.js";





const router = express.Router();


router.get("/me" ,authorization ,  getMyInfo)


router.post("/register" ,registerUser)


router.post("/login" , loginUser)

router.get("/allposts/:id" , authorization , isFollowed ,getAllUserPosts)

router.get("/logout" , logoutUser)

router.post("/post", authorization, uploader.single("img") , uploadPost)

router.route("/sendrequest/:id").get(authorization, sendReq)
router.get("/allrequests" ,authorization, getAllReq)
router.delete("/deletereq/:id" , authorization , deleteReq)
router.get("/acceptreq/:id", authorization ,acceptReq)

router.get("/followed/:id" , isFollowed)
router.get("/followinglist" , authorization ,getFollowingList )
router.get("/followerlist" , authorization , getFollowerList )
router.put("/unfollow/:id", authorization , unFollow)


router.get("/me/:id", async(req,res)=>{
    const {id} = req.params
    const response = await User.findById(id)
    res.json({
        response
    })

})

router.post("/upload",authorization , uploader.single("img"), async (req, res) => {
    try {
      // Upload image to cloudinary
      console.log(req.file)
      const result = await cloudinary.uploader
      .upload(req.file.path)
      // Create new user
      const newPost = await Post.create({
        description : "Dsfdd",
        img : result.secure_url,
        user : req.user._id,
      })
      console.log(newPost)
      res.status(200)
        .json({
          newPost
        });
    } catch (err) {
      console.log("hehe",err);
    }
  })

export default router; 