import { Etat, EtatProjet } from "@prisma/client";
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
    demandeurId: number;
    offreurId: number
};



// create projet
export const createProjet = async (projet: Omit<Projet, "id"| "duree"| "date_deb" | "etat" | "date_fin">): Promise<Projet> => {
    const { title, description, cc, demandeurId, offreurId } = projet;

    return await db.projet.create({
        data: {
            title,
            description,
            cc,
            etat: "enCours",
            offreurId,
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
            demandeurId: true,
            offreurId: true,
            offreur: true,
            demandeur: true,
        },
    });
}

// list Projets
export const listProjets = async (offreurId: number): Promise<Projet[]> => {
    return await db.projet.findMany({
        where: {
            offreurId,
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
            demandeur: true,
            demandeurId: true,
            offreurId: true,
        }
    });
};

// show Projet
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
            demandeur: true,
            demandeurId: true,
            offreurId: true,
        }
    });
};

// check if projet belongs to offreur
export const projetBolongsToOffreur = async (projetId: number, offreurId: number): Promise<Projet | null> => {
    return await db.projet.findUnique({
        where: {
            id: projetId,
            offreurId,
        }
    })
}


// update etat Projet
export const updateEtatProjet = async (etat: EtatProjet, id: number): Promise<Projet> => {
    return await db.projet.update({
        where: {
            id,
       },
        data: {
            etat,
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
            demandeur: true,
            demandeurId: true,
            offreurId: true,
        },
    });
};



