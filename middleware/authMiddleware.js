import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication failed: Token missing or invalid format' });
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' from the beginning

    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }

    // Find the user associated with the token
    console.log('Decoded token:', decoded); // Log the decoded token to see its content
    const user = await UserModel.findById(decoded.userId); // Change to findById based on token content
    console.log('Found user:', user); // Log the found user object
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed: User not found' });
    }

    // Check if the user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: User is not authorized to access this resource' });
    }

    // Attach the user object and token to the request for further use in route handlers
    req.user = user;
    req.token = token;

    // Proceed to the protected route
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed: Invalid token' });
  }
};

export default authMiddleware;
