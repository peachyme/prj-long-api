import express from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import * as SkillController from "../controllers/skill.controller";
import { isAuthenticated, isEmailVerified, isOffreur } from "../middleware";

export const skillRouter = express.Router();

// GET: List of skills
skillRouter.get("/", isAuthenticated, isEmailVerified, async (request: Request, response: Response) => {
    try {

        const skills = await SkillController.listSKills()
        return response.status(200).json(skills);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// GET: show skill
skillRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const skill = await SkillController.getSkill(id);
        if (skill) {
            return response.status(200).json(skill);
        }
        return response.status(404).json({"message": "Skill could not be found"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: create skill
// params : label
skillRouter.post("/create", isAuthenticated, isOffreur, isEmailVerified, body("label").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const skill = request.body;
        const newSkill = await SkillController.createSkill(skill);
        return response.status(201).json(newSkill);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// PUT: update skill
skillRouter.put("/:id/update", body("label").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const skill = request.body;
        const updatedSkill = await SkillController.updateSkill(skill, id);
        return response.status(200).json(updatedSkill);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete skill
skillRouter.delete("/:id/delete", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const { count } = await SkillController.deleteSkill(id);
        
        if (count > 0) {
            return response.status(200).json({"message": "Skill has been successfully deleted"});
        } else {
            return response.status(404).json({"message": "Skill could not be found"});
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
