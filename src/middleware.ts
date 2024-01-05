import { Request, Response, NextFunction } from 'express';
import { getAccessToken } from './controllers/auth.controller';
import { getUserById } from './controllers/user.controller';
import { getOffreur } from './controllers/offreur.controller';

// Extend the Express Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            payload?: any;
            user?: any;
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

    const user = await getUserById(payload.userId);
    request.user = user;
    
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json(error.name);
    }
    return response.status(401).json('🚫 Un-Authorized 🚫');
  }
  return next();
}

export const isOffreur = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userRole = request.user?.role;

    if (userRole !== 'offreur') {
      return response.status(403).json('Forbidden: Action requires the role of OFFREUR');
    }

    return next();

  } catch (error: any) {
      return response.status(500).json(error.message);
  }
}

export const isDemandeur = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userRole = request.user?.role;

    if (userRole !== 'demandeur') {
      return response.status(403).json('Forbidden: Action requires the role of DEMANDEUR');
    }

    return next();

  } catch (error: any) {
      return response.status(500).json(error.message);
  }
}

export const isProfileOwner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.user?.id;
    const OffreurId: number = parseInt(request.params.id, 10);;

    const offreur = await getOffreur(OffreurId);

    if(!offreur || userId !== offreur.user.id) {
      return response.status(403).json('Forbidden: not previliged');
    }

    return next();

  } catch (error: any) {
      return response.status(500).json(error.message);
  }
}
