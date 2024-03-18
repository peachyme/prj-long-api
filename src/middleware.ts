import { Request, Response, NextFunction } from 'express';
import { getAccessToken } from './controllers/auth.controller';
import { getUserById } from './controllers/user.controller';
import { getOffreur } from './controllers/offreur.controller';
import { getDemandeur } from './controllers/demandeur.controller';
import { demandeBolongsToDemandeur } from './controllers/demande.demandeur.controller';
import { demandeBolongsToOffreur } from './controllers/demande.offreur.controller';
import { projetBolongsToOffreur } from './controllers/project.offreur.controller';

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

export const isEmailVerified = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const emailVerified = request.user?.emailVerified;
    
    if (!emailVerified) {
      return response.status(403).json('Forbidden: Please verify your email');
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

export const isDemandeurProfileOwner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.user?.id;
    const demandeurId: number = parseInt(request.params.id, 10);;

    const demandeur = await getDemandeur(demandeurId);
    console.log(demandeur);
    

    if(!demandeur || userId !== demandeur.user.id) {
      return response.status(403).json('Forbidden: not prevjjdvsgjviliged');
    }

    return next();

  } catch (error: any) {
      return response.status(500).json(error.message);
  }
}

export const isDemandeOwner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const demandeurId: number = parseInt(request.params.id, 10);
    const demandeId: number = parseInt(request.params.dId, 10);

    const demande = await demandeBolongsToDemandeur(demandeId, demandeurId);

    if(!demande) {
      return response.status(403).json('Forbidden: not previliged');
    }

    return next();
    
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
}


export const isOffreurDemandeOwner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const offreurId: number = parseInt(request.params.id, 10);
    const demandeId: number = parseInt(request.params.dId, 10);

    const demande = await demandeBolongsToOffreur(demandeId, offreurId);

    if(!demande) {
      return response.status(403).json('Forbidden: not previliged');
    }

    return next();
    
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
}


export const isProjectOwner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const offreurId: number = parseInt(request.params.id, 10);
    const projectId: number = parseInt(request.params.pId, 10);

    const projet = await projetBolongsToOffreur(projectId, offreurId);

    if(!projet) {
      return response.status(403).json('Forbidden: not previliged');
    }

    return next();
    
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
}