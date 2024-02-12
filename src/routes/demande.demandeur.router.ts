import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as DemandeController from "../controllers/demande.demandeur.controller";
import * as OffreurController from "../controllers/offreur.controller";
import * as DemandeurController from "../controllers/demandeur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isDemandeur, isDemandeurProfileOwner, isDemandeOwner } from "../middleware";
import { Etat } from "@prisma/client";
import { sendDemandeAnnuleeEmail, sendDemandeEnvoyeeEmail, sendDemandeModifieeEmail, sendNewDemandeEmail } from "../utils/nodemailer";

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
demandeDemandeurRouter.post("/:id/demandes/send", isAuthenticated, isEmailVerified,  isDemandeur,  isDemandeurProfileOwner,
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

        

        const offreur = await OffreurController.getOffreur(demande.offreurId);   
        const demandeur = await DemandeurController.getDemandeur(demandeurId);       

        if (offreur && demandeur) {
            sendDemandeEnvoyeeEmail(demandeur.email, demandeur.fname, demandeur.lname, demande.title)
            sendNewDemandeEmail(offreur.email, offreur.fname, offreur.lname)
            .then(() => {
                response.status(201).json({'message' : 'New demande email sent successfully', 'new demande': newDemande});
            })
            .catch((error) => {
                response.status(404).json({'Error sending email:': error});
            });
        }
        
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
    try {
        const id: number = parseInt(request.params.dId, 10);
        const dem = await DemandeController.getDemande(id);

        if (dem?.etat !== "envoyee") {
            return response.status(404).json({"message": "Demande could not be modified : already being processed"});
        }
        else {
            const demande = request.body;
            const updatedDemande = await DemandeController.updateDemande(demande, id);

            const offreur = await OffreurController.getOffreur(demande.offreurId);        

            if (offreur) {
                sendDemandeModifieeEmail(offreur.email, offreur.fname, offreur.lname, demande.title)
                .then(() => {
                    response.status(201).json({'message' : 'Demande updated and email sent successfully', 'updated demande': updatedDemande});
                })
                .catch((error) => {
                    response.status(404).json({'Error sending email:': error});
                });
            }
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: cancel Demande
demandeDemandeurRouter.put("/:id/demandes/:dId/cancel", isAuthenticated, isEmailVerified, isDemandeur, isDemandeOwner, 
                        body("motif_annulation").isString(),
                        async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const id: number = parseInt(request.params.dId, 10);

        const dem = await DemandeController.getDemande(id);

        if (dem?.etat !== "envoyee") {
            return response.status(404).json({"message": "Demande could not be canceled : already being processed"});
        }
        else {
            const etat: Etat = "annulee";
            const motif = request.body;
            const demande = {etat, motif_annulation: motif.motif_annulation};

            const canceledDemande = await DemandeController.cancelDemande(demande, id);

            if (canceledDemande) {  
                const offreur = await OffreurController.getOffreur(dem.offreurId);        

                if (offreur) {
                    sendDemandeAnnuleeEmail(offreur.email, offreur.fname, offreur.lname, dem.title)
                    .then(() => {
                        response.status(201).json({'message' : 'Demande has been successfully canceled and offreur has been notified'});
                    })
                    .catch((error) => {
                        response.status(404).json({'Error notifying offreur by email:': error});
                    });
                }          
            } else {
                return response.status(404).json({"message": "Demande could not be found"});
            }
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

