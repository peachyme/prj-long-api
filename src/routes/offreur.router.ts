import express from "express";
import type { Response, Request } from "express";
import { body, query, validationResult } from "express-validator";

import * as OffreurController from "../controllers/offreur.controller";
import * as SkillController from "../controllers/skill.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner } from "../middleware";

export const offreurRouter = express.Router();

// GET: List of Offreurs
offreurRouter.get("/", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    try {
        const Offreurs = await OffreurController.listOffreurs()
        return response.status(200).json(Offreurs);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: Search Offreurs
// Query parameters: fname, lname, skills, address, city, zip, country
offreurRouter.get("/search", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    try {
        const searchCriteria = request.query;
        const searchResult = await OffreurController.searchOffreurs(searchCriteria);
        return response.status(200).json(searchResult);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show Offreur
offreurRouter.get("/:id", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
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
offreurRouter.post("/create", isAuthenticated, isOffreur, isEmailVerified, body("fname").isString(),  body("lname").isString(),
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
offreurRouter.put("/:id/update", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, 
                    body("fname").isString(), body("lname").isString(), body("apropos").isString(), 
                    body("phone").isString(), body("address").isString(), body("country").isString(), 
                    body("city").isString(), body("zip").isString(), 
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
offreurRouter.delete("/:id/delete", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await OffreurController.deleteOffreur(id);
        return response.status(204).json("Offreur has been successfully deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST : add skills to offreur
offreurRouter.put("/:id/addSkills", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
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
offreurRouter.delete("/:id/deleteSkills", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
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