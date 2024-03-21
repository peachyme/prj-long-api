import { EtatProjet, Offreur } from "@prisma/client";
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
    offreur: Offreur
};


// GET: list Projets
export const listProjets = async (demandeurId: number): Promise<Projet[]> => {
    return await db.projet.findMany({
        where: {
            demandeurId,
        },
        include: {
            offreur: true
        }
    });
};

// GET: show Projet
export const getProjet = async (id: number): Promise<Projet | null> => {
    return await db.projet.findUnique({
        where: {
            id,
        },
        include: {
            offreur: true,
        }
    });
};






