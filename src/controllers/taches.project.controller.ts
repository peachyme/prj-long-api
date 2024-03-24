import { Prisma, State } from "@prisma/client";
import { db } from "../utils/db.server";

type Tache = {
    id: number;
    title: string;
    description: string;
    statut: State;
    duree: number;
    date_debut: Date;
    date_fin: Date;
    membreId: number;
};



// create task
export const createTache = async (tache : Omit<Tache, "id" | "etat">, projetId: number): Promise<Tache> => {
    const { title, description, duree, date_fin, membreId } = tache;

    return await db.tache.create({
        data: {
            title,
            description,
            duree,
            date_fin,
            membreId,
            projetId
        },
        include: {
            membre: true,
        }
    });
}

// show task
export const getTache = async (id: number): Promise<Tache | null> => {
    return await db.tache.findUnique({
        where: {
            id,
        },
        include: {
            membre: true,
        }
    });
};


// update etat Tache
export const updateEtatTache = async (statut: State, id: number): Promise<Tache> => {
    return await db.tache.update({
        where: {
            id,
       },
        data: {
            statut,
        },
        include: {
            membre: true,
        },
    });
};

// update Membre Tache
export const updateMembreTache = async (membreId: number, id: number): Promise<Tache> => {
    return await db.tache.update({
        where: {
            id,
       },
        data: {
            membreId,
        },
        include: {
            membre: true,
        },
    });
};

// delete task
export const deleteTache = async (id: number): Promise<Prisma.BatchPayload> => {
    return await db.tache.deleteMany({
        where: {
            id,
        },
    });
};



