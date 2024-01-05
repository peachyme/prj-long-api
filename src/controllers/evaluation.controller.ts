import { Demandeur } from "@prisma/client";
import { db } from "../utils/db.server";

export type Evaluation = {
    note: number;
    commentaire: string;
    date: string;
    demandeur: Demandeur;

};

// GET: List of Evaluations
export const listEvaluations = async (): Promise<Evaluation[]> => {
    return db.evaluation.findMany({
        select: {
            id: true,
            note: true,
            commentaire: true,
            date: true,
            demandeur: true,
        },
    });
};

