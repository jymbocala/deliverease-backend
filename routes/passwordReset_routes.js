import express from 'express'; 
import UserModel from '../models/user.js'; 
import logger from '../utils/logger.js'; 
import bcrypt from 'bcryptjs'; 

// Create a new router
const router = express.Router();

// Define a POST route for resetting password
router.post('/reset-password/:token', async (req, res) => {
  // Extract the reset token from the request parameters
  const { token } = req.params;
  // Extract the new password from the request body
  const { newPassword } = req.body;

  try {
    // Log the request body to check the newPassword field
    logger.info('Request Body:', req.body);

    // Check if newPassword is provided
    if (!newPassword) {
      logger.error('No newPassword provided');
      // If not, return a 400 response
      return res.status(400).json({ message: 'No newPassword provided' });
    }

    // Find the user with the provided reset token and check if the token is not expired
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    // If the user doesn't exist or the token is expired, return a 400 response
    if (!user) {
      logger.error('Invalid or expired reset token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // Update the user's password and clear the reset token and its expiry date
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Save the updated user to the database
    await user.save();

    // Log a success message
    logger.info('Password reset successful');
    // Return a 200 response
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    // If there's an error, log it and return a 500 response
    logger.error(`Error resetting password: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
