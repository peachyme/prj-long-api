import { EtatProjet } from "@prisma/client";
import { db } from "../utils/db.server";

type Projet = {
    id: number;
    title: string;
    description: string;
    cc: string;
    duree: number | null;
    etat: EtatProjet;
    date_deb: Date;
    date_fin: Date | null;
};


// GET: list Projets
export const listProjets = async (demandeurId: number): Promise<Projet[]> => {
    return await db.projet.findMany({
        where: {
            demandeurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            cc: true,
            duree: true,
            date_deb: true,
            date_fin: true,
            offreur: true,
        }
    });
};

// GET: show Projet
export const getProjet = async (id: number): Promise<Projet | null> => {
    return await db.projet.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            cc: true,
            duree: true,
            date_deb: true,
            date_fin: true,
            offreur: true,
        }
    });
};






