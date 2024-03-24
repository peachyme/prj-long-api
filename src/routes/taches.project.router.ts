import express from "express";
import type { Response, Request } from "express";
import { body, query, validationResult } from "express-validator";

import * as TasksController from "../controllers/taches.project.controller";
import * as OffreurController from "../controllers/offreur.controller";
import * as ProjectController from "../controllers/project.demandeur.controller";
import { isEmailVerified, isAuthenticated, isOffreur, isProfileOwner } from "../middleware";
import { sendMembreProjetMail } from "../utils/nodemailer";
import { State } from "@prisma/client";

export const tachesRouter = express.Router();


// POST : create new task for project
tachesRouter.post("/:id/newTask", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified,
                        body("title").isString(),  body("description").isString(), 
                        body("duree").isInt(), body("date_fin").isISO8601().toDate(), 
                        body("membreId").isInt(), 
                        async (request:Request, response: Response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {

        const projectId: number = parseInt(request.params.id, 10);
        const task = request.body;

        const newTask = await TasksController.createTache(task, projectId);

        if (newTask) {
            return response.status(201).json({'message' : 'Task added to project and assigned to member successfully'});
        }               
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


// get task
tachesRouter.get("/:id/tasks/:tId", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request:Request, response: Response) => {
    const taskId: number = parseInt(request.params.tId, 10);

    try {            
        const task = await TasksController.getTache(taskId);
        if (task) {
            return response.status(200).json(task);
        }
        return response.status(404).json({"message": "Task could not be found"});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// update task state
tachesRouter.patch("/:id/tasks/:tId/updateState", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified,
                        body("statut").isString(),
                        async (request:Request, response: Response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {

        const id: number = parseInt(request.params.tId, 10);
        
        const statut: State = request.body.statut;

        const updatedTask = await TasksController.updateEtatTache(statut, id);

        if (updatedTask) {
            return response.status(201).json({'message' : 'Task status updated successfully'});
        }
        else {
            return response.status(404).json({"error" : "Task not found"});
        }               
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


// update task memeber
tachesRouter.patch("/:id/tasks/:tId/updateMembre", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified,
                        body("membreId").isInt(),
                        async (request:Request, response: Response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {

        const id: number = parseInt(request.params.tId, 10);
        const membreId: number = request.body.membreId;

        const updatedTask = await TasksController.updateMembreTache(membreId, id);

        if (updatedTask) {
            return response.status(201).json({'message' : 'Task member updated successfully'});
        }
        else {
            return response.status(404).json({"error" : "Task not found"});
        }               
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// DELETE: delete Tache
tachesRouter.delete("/:id/tasks/:tId/delete", isAuthenticated, isOffreur, isProfileOwner, isEmailVerified, async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.tId, 10);
    try {
        const { count } = await TasksController.deleteTache(id);
        if (count > 0) {            
            return response.status(200).json({"message": "Task has been deleted successfully"});
        } else {
            return response.status(404).json({"message": "Task could not be found"});
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});