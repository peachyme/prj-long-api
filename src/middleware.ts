import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getAccessToken } from './controllers/auth.controller';

// Extend the Express Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            payload?: any;
        }
    }
}

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json('🚫 Un-Authorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    // const payload: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    const payload = await getAccessToken(token);

    if (!payload) {
        return response.status(401).json({ message: '🚫 Un-Authorized 🚫' });
    }
    request.payload = payload;
    
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json(error.name);
    }
    return response.status(401).json('🚫 Un-Authorized 🚫');
  }
  return next();
}
