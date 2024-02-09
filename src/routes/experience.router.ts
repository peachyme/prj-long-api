import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as ExperienceController from "../controllers/experience.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner } from "../middleware";

export const experienceRouter = express.Router();

// GET: List of Experiences
experienceRouter.get("/:id/experiences", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const Experiences = await ExperienceController.listExperiences(id)
        return response.status(200).json(Experiences);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Experience
experienceRouter.get("/:id", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const experience = await ExperienceController.getExperience(id);
        if (experience) {
            return response.status(200).json(experience);
        }
        return response.status(404).json("Experience could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: add Experience to offreur
experienceRouter.post("/:id/experiences/add", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, body("title").isString(),  
                    body("description").isString(), body("link").isString(), body("from").isDate(), 
                    body("to").isDate(), 
                    async (request: Request, response: Response) => {
                        
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const experience = request.body;
        const offreurId = parseInt(request.params.id, 10);
        
        const newExperience = await ExperienceController.createExperience(experience, offreurId);
        return response.status(201).json(newExperience);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: update Experience
experienceRouter.put("/:id/experiences/:eId/update", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified,
                    body("title").isString(), body("description").isString(), body("link").isString(), 
                    body("from").isDate(), body("to").isDate(), 
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.eId, 10);
    try {
        const experience = request.body;
        const updatedExperience = await ExperienceController.updateExperience(experience, id);
        return response.status(200).json(updatedExperience);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete Experience
experienceRouter.delete("/:id/experiences/:eId/delete", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.eId, 10);
    try {
        const { count } = await ExperienceController.deleteExperience(id);
        if (count > 0) {            
            return response.status(200).json({"message": "Experience has been successfully deleted"});
        } else {
            return response.status(404).json({"message": "Experience could not be found"});
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
