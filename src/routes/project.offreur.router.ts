import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as projetController from "../controllers/project.offreur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProjectOwner } from "../middleware";
import { EtatProjet } from "@prisma/client";

export const projetOffreurRouter = express.Router();

// GET: List of projets
projetOffreurRouter.get("/:id/projets", isAuthenticated, isEmailVerified, isOffreur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const projets = await projetController.listProjets(id)
        return response.status(200).json(projets);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show projet
projetOffreurRouter.get("/:id/projets/:pId", isAuthenticated, isEmailVerified, isOffreur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.pId, 10);
    try {
        const projet = await projetController.getProjet(id);
        if (projet) {
            return response.status(200).json(projet);
        }
        return response.status(404).json("projet could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: accepter demande + generer facture
projetOffreurRouter.put("/:id/projets/:pId/update", isAuthenticated, isEmailVerified,  isOffreur,  isProjectOwner,
                    body("etat").isString(),
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const newEtat: EtatProjet = request.body.etat;
        const projetId = parseInt(request.params.pId, 10);
        
        const updatedProjet = await projetController.updateEtatProjet(newEtat, projetId);

        if (updatedProjet) {
                return response.status(201).json({'message' : 'Project status updated successfully', 'updated projet': updatedProjet});
        } else {
            return response.status(404).json({'message': 'Project not found'});
        }      
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

