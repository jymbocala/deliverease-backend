// Import the AWS SDK
import AWS from 'aws-sdk';

// Configure the AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

// Function to handle uploading to AWS S3
async function uploadToS3(file) {
  try {
    // Create a new instance of the S3 service
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
      },
      region: "ap-southeast-2",
    });

    // Generate a unique file key based on the current timestamp and file name
    const fileKey = `uploads/${Date.now().toString()}-${file.name.replace(
      / /g,
      "-"
    )}`;

    // Set up parameters for the S3 upload
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file,
    };

    // Perform the upload to S3
    const upload = s3.upload(params).promise();

    // Log progress during the upload
    upload.on("httpUploadProgress", (evt) => {
      // Log the percentage of the upload that is complete
      console.log(
        "Uploading to S3...",
        parseInt(((evt.loaded * 100) / evt.total).toString()) + "%"
      );
    });

    // Wait for the upload to complete before continuing
    await upload.then((data) => {
      console.log("Successfully uploaded to S3", file_key);
    });

    // Return file information
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
  // Return the URL of the file
  return `https://${process.env.S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${fileKey}`;
}

// module.exports = {
//   uploadToS3,
//   getS3Url,
// };
export { uploadToS3, getS3Url };
