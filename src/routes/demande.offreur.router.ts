import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as DemandeController from "../controllers/demande.offreur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner, isOffreurDemandeOwner } from "../middleware";
import { Etat } from "@prisma/client";

export const demandeOffreurRouter = express.Router();

// GET: List of Demandes
demandeOffreurRouter.get("/:id/demandes", isAuthenticated, isEmailVerified, isOffreur, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const demandes = await DemandeController.listDemandes(id)
        return response.status(200).json(demandes);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Demande
demandeOffreurRouter.get("/:id/demandes/:dId", isAuthenticated, isEmailVerified, isOffreur, isProfileOwner, async (request: Request, response: Response) => {
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

// PUT: Traiter demande + planifier RDV
demandeOffreurRouter.put("/:id/demandes/:dId/traiter", isAuthenticated, isEmailVerified,  isOffreur,  isOffreurDemandeOwner,
                    body("date").isDate(), body("type").isString(),
                    body("address").isString(), body("link").isString(),
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const etat: Etat = "enCoursDeTraitement";
        const demande = {etat, motif_refus: null}
        const rdv = request.body;
        const demandeId = parseInt(request.params.dId, 10);
        
        const updatedDemande = await DemandeController.updateEtatDemande(demande, demandeId);
        await DemandeController.planRdv(rdv, demandeId);
        return response.status(201).json(updatedDemande);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: refuser demande + motif refus
demandeOffreurRouter.put("/:id/demandes/:dId/refuser", isAuthenticated, isEmailVerified,  isOffreur,  isOffreurDemandeOwner,
                    body("motif_refus").isString(),
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const id: number = parseInt(request.params.dId, 10);
        const dem = await DemandeController.getDemande(id);

        if (dem?.etat === "confirmee") {
            return response.status(404).json({"message": "Action cannot be completed : Demande already confirmed"});
        }
        else {
            const etat: Etat = "refusee";
            const motif = request.body;
            const demande = {etat, motif_refus: motif.motif_refus}
            const demandeId = parseInt(request.params.dId, 10);
            
            const updatedDemande = await DemandeController.updateEtatDemande(demande, demandeId);
            return response.status(201).json(updatedDemande);
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: accepter demande + generer facture
demandeOffreurRouter.put("/:id/demandes/:dId/accepter", isAuthenticated, isEmailVerified,  isOffreur,  isOffreurDemandeOwner,
                    body("montant").isInt(),
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const etat: Etat = "acceptee";
        const montant = request.body;
        const demande = { etat, motif_refus: null }
        const facture = { montant: montant.montant }
        const demandeId = parseInt(request.params.dId, 10);
        
        const updatedDemande = await DemandeController.updateEtatDemande(demande, demandeId);
        await DemandeController.generateFacture(facture, demandeId);
        return response.status(201).json(updatedDemande);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

