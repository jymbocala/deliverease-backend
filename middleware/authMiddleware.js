import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';
import logger from '../utils/logger.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error('Authentication failed: Token missing or invalid format');
      return res.status(401).json({ error: 'Authentication failed: Token missing or invalid format' });
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' from the beginning

    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      logger.error('Authentication failed: Invalid token');
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    // Find the user associated with the token
    logger.info('Decoded token:', decoded);
    const user = await UserModel.findById(decoded.userId);
    logger.info('Found user:', user);
    if (!user) {
      logger.error('Authentication failed: User not found');
      return res.status(401).json({ error: 'Authentication failed: User not found' });
    }

    // Attach the user to the req object
    req.user = user;

    // Proceed to the protected route
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
};

export default authMiddleware;