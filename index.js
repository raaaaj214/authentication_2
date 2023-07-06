import express from "express";
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


app.use("/user" , userRouter)


app.get("/" , (req,res) => {

    res.status(200).json({
        success : true,
        message : "Home page"
    })
})





app.listen(process.env.PORT, () => {
    console.log("Server Started...")
})
