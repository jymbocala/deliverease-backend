import UserModel from "../models/user.js";
import logger from "../utils/logger.js";
import crypto from "crypto";
import mailgun from "mailgun-js";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const emailTemplate = `
      <p>Please reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `;

    const mailData = {
      from: "noreply@example.com",
      to: email,
      subject: "Reset your password",
      html: emailTemplate,
    };

    mg.messages().send(mailData, function (error, body) {
      if (error) {
        logger.error(`Error sending password reset email: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
      } else {
        logger.info(`Password reset email sent to: ${email}`);
        res.status(200).json({ message: "Password reset email sent" });
      }
    });
  } catch (error) {
    logger.error(`Error sending password reset email: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
