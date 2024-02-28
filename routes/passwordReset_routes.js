import express from 'express';
import UserModel from '../models/user.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Log the request body to check the newPassword field
    logger.info('Request Body:', req.body);

    if (!newPassword) {
      logger.error('No newPassword provided');
      return res.status(400).json({ message: 'No newPassword provided' });
    }

    // Find user by reset token
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      logger.error('Invalid or expired reset token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info('Password reset successful');
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error(`Error resetting password: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
