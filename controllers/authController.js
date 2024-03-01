import UserModel from "../models/user.js"; 
import logger from "../utils/logger.js"; // Logger for logging information and errors
import crypto from "crypto"; // Node.js crypto module for generating random bytes
import mailgun from "mailgun-js"; // Mailgun module for sending emails

// Initialize Mailgun with API key and domain from environment variables
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Export the forgotPassword function
export const forgotPassword = async (req, res) => {
  // Extract email from request body
  const { email } = req.body;

  try {
    // Find user with the provided email
    const user = await UserModel.findOne({ email });
    if (!user) {
      // If user not found, log error and send 404 response
      logger.error(`User not found with email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token using crypto module
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Set reset token and expiration time on user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the user model with the new reset token and expiration
    await user.save();

    // Construct reset link with the generated token
    const resetLink = `https://deliverease-api.onrender.com/reset-password/${resetToken}`;
    // Construct email template with the reset link
    const emailTemplate = `
      <p>Please reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `;

    // Construct mail data with sender, receiver, subject, and HTML content
    const mailData = {
      from: "support@deliverease.com",
      to: email,
      subject: "Reset your password",
      html: emailTemplate,
    };

    // Send the email using Mailgun
    mg.messages().send(mailData, function (error, body) {
      if (error) {
        // If there's an error, log it and send a 500 response
        logger.error(`Error sending password reset email: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // If successful, log the success and send a 200 response
        logger.info(`Password reset email sent to: ${email}`);
        res.status(200).json({ message: "Password reset email sent" });
      }
    });
  } catch (error) {
    // If there's an error in the try block, log it and send a 500 response
    logger.error(`Error sending password reset email: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};