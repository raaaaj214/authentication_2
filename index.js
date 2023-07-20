import express from "express";
import postRouter from "./routes/post.js"
import userRouter from "./routes/user.js"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import 'dotenv/config'



const app = express();

// database
mongoose.connect(process.env.MONGODB_URL, {
    dbName : "ecommerce",
}).then(() => {
    console.log("DB Started...")
}).catch(error => console.log(error))



// middlewares
app.use(cors({
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE"],
     origin:'http://localhost:3000', //or whatever port your frontend is using
    credentials:true,            
    optionSuccessStatus:200
}))

app.use(cookieParser())

app.use(express.urlencoded({
    extended : true
}))

app.use(express.json())


app.use("/post", postRouter)
app.use("/user" , userRouter)


app.get("/" , (req,res) => {

    res.status(200).json({
        success : true,
        message : "Home page"
    })
})


app.listen(process.env.PORT, () => {
    const date = new Date()
    console.log(date.toDateString())
    console.log(`Server Started on port ${process.env.PORT} in mode ${process.env.MODE}`)
})
