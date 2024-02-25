import { Etat, Prisma, Type } from "@prisma/client";
import { db } from "../utils/db.server";

type Facture = {
    id: number; 
    montant: number; 
    date_generation: Date; 
    createdAt: Date; 
    updatedAt: Date; 
    demandeId: number;
}
type Demande = {
    id: number;
    title: string;
    description: string;
    etat: Etat;
    motif_annulation: string | null;
    motif_refus: string | null;
    date_emission: Date;
    cc: string;
    offreurId: number;
    demandeurId: number;
    facture: Facture | null;
};

type DemandeAnnulee = {
    etat: Etat;
    motif_annulation: string | null;
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
            motif_annulation: true,
            motif_refus: true,
            offreurId: true,
            demandeurId: true
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
            motif_annulation: true,
            motif_refus: true,
            offreurId: true,
            demandeurId: true
        }
    });
};


// check if demande belongs to demandeur
export const demandeBolongsToDemandeur = async (demandeId: number, demandeurId: number): Promise<Omit<Demande, "facture"> | null > => {
    return await db.demande.findUnique({
        where: {
            id: demandeId,
            demandeurId,
        }
    })
}

// POST: create Demande
export const createDemande = async (demande: Omit<Demande, "id">, offreurId: number, demandeurId: number): Promise<Omit<Demande, "motif_annulation" | "motif_refus" | "offreurId" | "demandeurId" | "facture">> => {
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
export const updateDemande = async (demande: Omit<Demande, "id">, id: number): Promise<Omit<Demande, "motif_annulation" | "motif_refus" | "offreurId" | "demandeurId" | "facture">> => {
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


//  cancel Demande
export const cancelDemande = async (demande: DemandeAnnulee, id: number): Promise<Omit<Demande, "facture">> => {
    const { etat, motif_annulation } = demande;
    return await db.demande.update({
        where: {
            id
        },
        data: {
            etat,
            motif_annulation
        }
    });
};


// confirm Demande
export const confirmDemande = async (id: number): Promise<Omit<Demande, "facture">> => {
    return await db.demande.update({
        where: {
            id
        },
        data: {
            etat: "confirmee",
        }
    });
};






