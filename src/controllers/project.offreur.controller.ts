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
    offreurId: number;
    demandeId: number;
};



// create projet
export const createProjet = async (projet: Omit<Projet, "id"| "duree"| "date_deb" | "etat" | "date_fin">): Promise<Projet> => {
    const { title, description, cc, demandeurId, offreurId, demandeId } = projet;

    return await db.projet.create({
        data: {
            title,
            description,
            cc,
            etat: "enCours",
            offreurId,
            demandeurId,
            demandeId
        },
        include: {
            offreur: true,
            demandeur: true,
        }
    });
}

// list Projets
export const listProjets = async (offreurId: number): Promise<Projet[]> => {
    return await db.projet.findMany({
        where: {
            offreurId,
        },
        include: {
            demandeur: true,
        }
    });
};

// show Projet
export const getProjet = async (id: number): Promise<Projet | null> => {
    return await db.projet.findUnique({
        where: {
            id,
        },
        include: {
            demandeur: true,
            demande: true,
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
        include: {
            demandeur: true,
            demande: true,
        },
    });
};



