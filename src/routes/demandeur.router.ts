import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as DemandeurController from "../controllers/demandeur.controller";
import { isEmailVerified, isAuthenticated, isDemandeur, isDemandeurProfileOwner } from "../middleware";

export const DemandeurRouter = express.Router();

// GET: List of Demandeurs
DemandeurRouter.get("/", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    try {
        const demandeurs = await DemandeurController.listDemandeurs()
        return response.status(200).json(demandeurs);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Demandeur
DemandeurRouter.get("/:id", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const demandeur = await DemandeurController.getDemandeur(id);
        if (demandeur) {
            return response.status(200).json(demandeur);
        }
        return response.status(404).json("Demandeur could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: create Demandeur
// params : label
DemandeurRouter.post("/create", isAuthenticated, isDemandeur, isEmailVerified, body("fname").isString(),  body("lname").isString(),
                    body("phone").isString(), body("address").isString(), body("country").isString(), 
                    body("city").isString(), body("zip").isString(),
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const demandeur = request.body;
        const user = request.user;
        const newDemandeur = await DemandeurController.createDemandeur(demandeur, user);
        return response.status(201).json(newDemandeur);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: update Demandeur
DemandeurRouter.put("/:id/update", isAuthenticated, isDemandeur, isDemandeurProfileOwner, isEmailVerified, 
                    body("fname").isString(), body("lname").isString(), body("phone").isString(), 
                    body("address").isString(), body("country").isString(), 
                    body("city").isString(), body("zip").isString(), 
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const demandeur = request.body;
        const updatedDemandeur = await DemandeurController.updateDemandeur(demandeur, id);
        return response.status(200).json(updatedDemandeur);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete Demandeur
DemandeurRouter.delete("/:id/delete", isAuthenticated, isDemandeur, isDemandeurProfileOwner, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await DemandeurController.deleteDemandeur(id);
        return response.status(204).json("Demandeur has been successfully deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
