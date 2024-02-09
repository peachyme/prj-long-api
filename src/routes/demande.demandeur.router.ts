import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as DemandeController from "../controllers/demande.demandeur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isDemandeur, isDemandeurProfileOwner, isDemandeOwner } from "../middleware";

export const demandeDemandeurRouter = express.Router();

// GET: List of Demandes
demandeDemandeurRouter.get("/:id/demandes", isAuthenticated, isEmailVerified, isDemandeur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const demandes = await DemandeController.listDemandes(id)
        return response.status(200).json(demandes);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Demande
demandeDemandeurRouter.get("/:id/demandes/:dId", isAuthenticated, isEmailVerified, isDemandeur, isDemandeurProfileOwner, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.dId, 10);
    try {
        const demande = await DemandeController.getDemande(id);
        if (demande) {
            return response.status(200).json(demande);
        }
        return response.status(404).json("Demande could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: add Demande to offreur
demandeDemandeurRouter.post("/:id/demandes/add", isAuthenticated, isEmailVerified,  isDemandeur,  isDemandeurProfileOwner,
                    body("title").isString(),  body("description").isString(), 
                    body("cc").isString(), body("offreurId").isInt(), 
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const demande = request.body;
        const demandeurId = parseInt(request.params.id, 10);
        
        const newDemande = await DemandeController.createDemande(demande, demande.offreurId, demandeurId);
        return response.status(201).json(newDemande);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: update Demande
demandeDemandeurRouter.put("/:id/demandes/:dId/update", isAuthenticated, isEmailVerified, isDemandeur, isDemandeOwner, 
                    body("title").isString(),  body("description").isString(), 
                    body("cc").isString(), body("offreurId").isNumeric(), 
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.dId, 10);
    try {
        const demande = request.body;
        const updatedDemande = await DemandeController.updateDemande(demande, id);
        return response.status(200).json(updatedDemande);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete Demande
demandeDemandeurRouter.delete("/:id/Demandes/:dId/delete", isAuthenticated, isEmailVerified, isDemandeur, isDemandeOwner, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.dId, 10);
    try {
        const { count } = await DemandeController.cancelDemande(id);
        if (count > 0) {            
            return response.status(200).json({"message": "Demande has been successfully canceled"});
        } else {
            return response.status(404).json({"message": "Demande could not be found"});
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
