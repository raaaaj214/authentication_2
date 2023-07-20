import express from "express"
import { commentOnPost, deletePost, gerAllPosts, getComments, postLiked } from "../controller/post.js";
import { authorization } from "../middleware/authorization.js";

const router = express.Router();

router.get("/all" , authorization, gerAllPosts);

router.route("/:id",).put(authorization , postLiked).delete(authorization , deletePost)

router.put("/comment/:id" ,authorization, commentOnPost)

router.get("/getcomments/:id" , getComments )
export default router;