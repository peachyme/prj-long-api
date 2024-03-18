import express from "express";
import type { Response, Request } from "express";
import { body, query, validationResult } from "express-validator";

import * as MembresProjetController from "../controllers/memebres.project.controller";
import * as OffreurController from "../controllers/offreur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner } from "../middleware";

export const membresProjetRouter = express.Router();


// POST : add member to project
membresProjetRouter.put("/:id/addMembre", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
    const projectId: number = parseInt(request.params.id, 10);
    const { membreId, role } = request.body;

    try {
        if (await OffreurController.getOffreur(membreId)) {
            await MembresProjetController.addMembre(membreId, projectId, role);  
        }        
        else {
            return response.status(200).json({"message": "Offreur does not exist"});
        }           
        return response.status(200).json({"message": "Member added to project successfully"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


// remove project memeber
membresProjetRouter.delete("/:id/removeMembre", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
    const projectId: number = parseInt(request.params.id, 10);
    const { membreId } = request.body;

    try {            
        if (await OffreurController.getOffreur(membreId)) {
            await MembresProjetController.removeMembre(projectId, membreId);    
        }        
        else {
            return response.status(200).json({"message": "Offreur could not be found in the project"});
        }
        return response.status(200).json({"message": "Offreur removed successfully"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});