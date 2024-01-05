import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as OffreurController from "../controllers/offreur.controller";
import * as SkillController from "../controllers/skill.controller";
import { isAuthenticated, isOffreur, isProfileOwner } from "../middleware";

export const OffreurRouter = express.Router();

// GET: List of Offreurs
OffreurRouter.get("/", isAuthenticated, async (request: Request, response: Response) => {
    try {
        const Offreurs = await OffreurController.listOffreurs()
        return response.status(200).json(Offreurs);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Offreur
OffreurRouter.get("/:id", isAuthenticated, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const Offreur = await OffreurController.getOffreur(id);
        if (Offreur) {
            return response.status(200).json(Offreur);
        }
        return response.status(404).json("Offreur could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: create Offreur
// params : label
OffreurRouter.post("/create", isAuthenticated, isOffreur, body("fname").isString(),  body("lname").isString(),
                    body("apropos").isString(), body("phone").isString(), body("address").isString(), 
                    body("country").isString(), body("city").isString(), body("zip").isString(),
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const Offreur = request.body;
        const user = request.user;
        const newOffreur = await OffreurController.createOffreur(Offreur, user);
        return response.status(201).json(newOffreur);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: update Offreur
OffreurRouter.put("/:id/update", isAuthenticated, isOffreur, isProfileOwner, body("fname").isString(), 
                    body("lname").isString(), body("apropos").isString(), body("phone").isString(), 
                    body("address").isString(), body("country").isString(), body("city").isString(), body("zip").isString(), 
                    async (request: Request, response: Response
                ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const Offreur = request.body;
        const updatedOffreur = await OffreurController.updateOffreur(Offreur, id);
        return response.status(200).json(updatedOffreur);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete Offreur
OffreurRouter.delete("/:id/delete", isAuthenticated, isOffreur, isProfileOwner, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await OffreurController.deleteOffreur(id);
        return response.status(204).json("Offreur has been successfully deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST : add skills to offreur
OffreurRouter.put("/:id/addSkills", isAuthenticated, isOffreur, isProfileOwner,async (request:Request, response: Response) => {
    const offreurId: number = parseInt(request.params.id, 10);
    const { skills } = request.body;

    try {
        for (const skill of skills) {
            const skillId = parseInt(skill.id, 10);

            if (await SkillController.getSkill(skillId)) {
                if (await OffreurController.offreurHasSkill(offreurId, skillId)) {
                    return response.status(200).json({"message": "You already have this skill added"});
                } else {
                    await OffreurController.addSkillsToOffreur(offreurId, skillId, skill.level);  
                }        
            }        
            else {
                return response.status(200).json({"message": "Skill does not exist"});
            }           
        }
        return response.status(200).json({"message": "Skills added successfully"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


// DELETE : delete skills of offreur
OffreurRouter.delete("/:id/deleteSkills", isAuthenticated, isOffreur, isProfileOwner,async (request:Request, response: Response) => {
    const offreurId: number = parseInt(request.params.id, 10);
    const { skills } = request.body;

    try {
        for (const skill of skills) {
            const skillId = parseInt(skill.id, 10);
            const dbSkill = await SkillController.getSkill(skillId);
            
            if (await OffreurController.offreurHasSkill(offreurId, skillId)) {
                await OffreurController.deleteSkillFromOffreur(offreurId, skillId);    
            }        
            else {
                return response.status(200).json({"message": "Skill could not be found in Offreur"});
            }
        }
        return response.status(200).json({"message": "Skills deleted successfully"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});