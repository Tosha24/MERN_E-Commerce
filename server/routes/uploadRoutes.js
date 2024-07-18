import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();


// Configure Cloudinary


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "E-COMMERCE", // The name of the folder in Cloudinary
    format: async (req, file) => "png, jpg, jpeg, webp", // supports promises as well
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`, // The name of the file within the folder
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  if (filetypes.test(path.extname(file.originalname).toLowerCase()) && mimetypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
};

const upload = multer({ storage, fileFilter });
const router = express.Router();

router.post("/", (req, res) => {
  const uploadSingleImage = upload.single("image");

  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.log(err)
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        imageUrl: req.file.path, // URL of the uploaded image
      });
    } else {

      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
