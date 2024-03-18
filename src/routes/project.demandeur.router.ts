import express from "express";
import type { Response, Request } from "express";

import * as projetController from "../controllers/project.demandeur.controller";
import { isEmailVerified, isAuthenticated, isDemandeur } from "../middleware";

export const projetDemandeurRouter = express.Router();

// GET: List of projets
projetDemandeurRouter.get("/:id/projets", isAuthenticated, isEmailVerified, isDemandeur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const projets = await projetController.listProjets(id)
        return response.status(200).json(projets);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show projet
projetDemandeurRouter.get("/:id/projets/:dId", isAuthenticated, isEmailVerified, isDemandeur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.dId, 10);
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
