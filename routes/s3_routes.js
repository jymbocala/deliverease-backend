import { Router } from "express";
import { uploadToS3, getS3Url } from "../s3.js";
import multer from "multer";

const router = Router();

// const upload = multer({ dest: "uploads/" }); // Specify the destination folder to store uploaded files

const upload = multer(); 


// Route to upload an image to AWS S3
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    // Check if the request contains a file
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    const imageFile = req.file;

    // Call the uploadToS3 function to upload the image to S3
    const result = await uploadToS3(imageFile);

    // Send the S3 file key back as a response
    res.json({ fileKey: result.fileKey });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).send({ error: "Failed to upload file" });
  }
});

// Route to get the publicly accessible URL of an image from S3
router.get("/url/:fileKey", (req, res) => {
  const fileKey = req.params.fileKey;

  // Call the getS3Url function to get the URL of the image
  const s3Url = getS3Url(fileKey);

  // Send the URL back as a response
  res.json({ url: s3Url });
});

export default router;
