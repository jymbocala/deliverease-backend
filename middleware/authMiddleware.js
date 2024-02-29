import jwt from 'jsonwebtoken'; // JSON Web Token for handling tokens
import UserModel from '../models/user.js'; 
import logger from '../utils/logger.js'; // Logger for logging information and errors

// Define the authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const authHeader = req.header('Authorization');
    // Check if the token exists and if it starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If not, log an error and return a 401 response
      logger.error('Authentication failed: Token missing or invalid format');
      return res.status(401).json({ error: 'Authentication failed: Token missing or invalid format' });
    }
    // Extract the actual token by removing 'Bearer ' from the beginning
    const token = authHeader.substring(7);

    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If the token is invalid, log an error and return a 401 response
    if (!decoded) {
      logger.error('Authentication failed: Invalid token');
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    // Log the decoded token
    logger.info('Decoded token:', decoded);
    // Find the user associated with the token
    const user = await UserModel.findById(decoded.userId);
    // Log the found user
    logger.info('Found user:', user);
    // If the user doesn't exist, log an error and return a 401 response
    if (!user) {
      logger.error('Authentication failed: User not found');
      return res.status(401).json({ error: 'Authentication failed: User not found' });
    }

    // Attach the user to the req object for use in subsequent middleware or route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If there's an error, log it and return a 401 response
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
};

// Export the authentication middleware
export default authMiddleware;