import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as EvaluationController from "../controllers/evaluation.controller";
import * as UserController from "../controllers/user.controller";
import { isEmailVerified, isAuthenticated, isDemandeur } from "../middleware";

export const evaluationRouter = express.Router();


// POST: add evaluation to offreur
evaluationRouter.post("/:id/evaluations/add", isAuthenticated, isDemandeur, isEmailVerified, 
                    body("note").isInt(), body("commentaire").isString(), 
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const evaluation = request.body;
        const offreurId: number = parseInt(request.params.id, 10);
        const userId: string = request.user.id;
        const user = await UserController.getUserById(userId);
        let demandeurId = 0
        if (user?.demandeur) {
            demandeurId = user.demandeur.id;
        }
        
        
        
        const newEvaluation = await EvaluationController.newEvaluation(evaluation, demandeurId, offreurId);
        return response.status(201).json(evaluation);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
