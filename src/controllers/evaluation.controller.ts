import { Demandeur } from "@prisma/client";
import { db } from "../utils/db.server";

export type Evaluation = {
    note: number;
    commentaire: string;
};

// submit evaluation
export const newEvaluation = async (evaluation: Evaluation, demandeurId: number, offreurId: number): Promise<Evaluation> => {
    const {note, commentaire} = evaluation;
    return await db.evaluation.create({
        data: {
            note,
            commentaire,
            demandeurId,
            offreurId,
        },
    });
};

