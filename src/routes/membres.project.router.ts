import express from "express";
import type { Response, Request } from "express";
import { body, query, validationResult } from "express-validator";

import * as MembresProjetController from "../controllers/memebres.project.controller";
import * as OffreurController from "../controllers/offreur.controller";
import * as ProjectController from "../controllers/project.demandeur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner } from "../middleware";
import { sendMembreProjetMail } from "../utils/nodemailer";

export const membresProjetRouter = express.Router();


// POST : add member to project
membresProjetRouter.put("/:id/addMembre", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
    const projectId: number = parseInt(request.params.id, 10);
    const { membreId, role } = request.body;

    try {
        const offreur = await OffreurController.getOffreur(membreId);
        const project = await ProjectController.getProjet(projectId);
        if (offreur) {
            await MembresProjetController.addMembre(membreId, projectId, role);  
            if (offreur && project) {
                sendMembreProjetMail(offreur.email, offreur.lname, offreur.fname, project.offreur.lname, project.offreur.fname, project.title)
                .then(() => {
                    response.status(201).json({'message' : 'Member added to project and notification email sent successfully'});
                })
                .catch((error) => {
                    response.status(404).json({'Error sending email:': error});
                });
            } 
        }        
        else {
            return response.status(200).json({"message": "Offreur does not exist"});
        }                  
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