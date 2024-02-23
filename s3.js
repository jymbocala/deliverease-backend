// Import the AWS SDK
import AWS from "aws-sdk";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Configure the AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

// Function to upload a file to S3
async function uploadToS3(file) {
  console.log("File object:", file); // Output should be the file object

  try {
    // Create a new instance of the S3 service
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
      },
      region: "ap-southeast-2",
    });

    // Generate a unique file key based on the current timestamp and file name
    const fileKey = `${Date.now().toString()}-${file.originalname.replace(
      / /g,
      "-"
    )}`;

    // Set up parameters for the S3 upload
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer, // Use file.buffer instead of the entire file object because the file object is not compatible with the S3 upload function (putObject)
    };

    // Upload to S3 bucket
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "uploading to S3...",
          parseInt(((evt.loaded * 100) / evt.total).toString()) + "%"
        );
      })
      .promise();

    // Wait for the upload to complete before continuing
    await upload.then((data) => {
      console.log("Successfully uploaded to S3", fileKey); // Corrected fileKey variable name
    });

    // Return file information including the file key and file name so that it can be stored in the database
    return {
      fileKey,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

// Function to get the publicly accessible S3 URL of a file
function getS3Url(fileKey) {
  // console.log("File key:", fileKey); // Output should be the file key
  // Return the URL of the file
  return `https://${process.env.S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${fileKey}`;
}

// Function to delete a file from S3
async function deleteFromS3(fileKey) {
  try {
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
      },
      region: "ap-southeast-2",
    });

    // Set up parameters for the S3 delete operation
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    };

    // Delete the object from the S3 bucket
    await s3.deleteObject(params).promise();

    console.log(`Image ${fileKey} deleted successfully from S3`);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    throw error;
  }
}

export { uploadToS3, getS3Url, deleteFromS3 };
