import multer from "multer"

const DIR = "../images"
export const uploader = multer({
  storage: multer.diskStorage({   
    destination: (req, file, cb) => {
    cb(null, DIR)
},   
   filename: (req, file, cb) => {     
    cb(null, Date.now() + "-" + file.originalname); 
  },
 }),
  limits: {  fileSize: 20 * 1024 * 1024  }
});
