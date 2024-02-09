import { Etat, Prisma, Type } from "@prisma/client";
import { db } from "../utils/db.server";

type Demande = {
    id: number;
    title: string;
    description: string;
    etat: Etat;
    date_emission: Date;
    cc: string;
};


// GET: list Demandes
export const listDemandes = async (demandeurId: number): Promise<Demande[]> => {
    return await db.demande.findMany({
        where: {
            demandeurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            date_emission: true,
            cc: true,
            offreur: true,
            facture: true,
            rdv: true,
        }
    });
};

// GET: show Demande
export const getDemande = async (id: number): Promise<Demande | null> => {
    return await db.demande.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            date_emission: true,
            cc: true,
            offreur: true,
            facture: true,
            rdv: true,
        }
    });
};

// check if demande belongs to demandeur
export const demandeBolongsToDemandeur = async (demandeId: number, demandeurId: number): Promise<Demande | null> => {
    return await db.demande.findUnique({
        where: {
            id: demandeId,
            demandeurId,
        }
    })
}

// POST: create Demande
export const createDemande = async (demande: Omit<Demande, "id">, offreurId: number, demandeurId: number): Promise<Demande> => {
    const { title, description, cc } = demande;

    return await db.demande.create({
        data: {
            title,
            description,
            cc,
            offreurId,
            demandeurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            date_emission: true,
            cc: true,
            offreur: true,
            demandeur: true
        },
    });
};


// POST: update Demande
export const updateDemande = async (demande: Omit<Demande, "id">, id: number): Promise<Demande> => {
    const { title, description, cc } = demande;

    return await db.demande.update({
        where: {
            id
        },
        data: {
            title,
            description,
            cc,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            date_emission: true,
            cc: true,
            offreur: true,
            demandeur: true
        },
    });
};


// POST: cancel Demande
export const cancelDemande = async (id: number): Promise<Prisma.BatchPayload> => {
    return await db.demande.deleteMany({
        where: {
            id
        }
    });
};






