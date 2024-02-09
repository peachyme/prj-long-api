import { Etat, Type } from "@prisma/client";
import { db } from "../utils/db.server";

type Demande = {
    id: number;
    title: string;
    description: string;
    etat: Etat;
    motif_refus: string | null;
    date_emission: Date;
    cc: string;
};

type Rdv = {
    id: number;
    heure: string;
    date: string;
    address: string | null;
    link: string | null;
    type: Type;
};

type Facture = {
    montant: number;
}

// GET: list Demandes
export const listDemandes = async (offreurId: number): Promise<Demande[]> => {
    return await db.demande.findMany({
        where: {
            offreurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            motif_refus: true,
            date_emission: true,
            cc: true,
            demandeur: true,
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
            motif_refus: true,
            date_emission: true,
            cc: true,
            demandeur: true,
            facture: true,
            rdv: true,
        }
    });
};

// check if demande belongs to offreur
export const demandeBolongsToOffreur = async (demandeId: number, offreurId: number): Promise<Demande | null> => {
    return await db.demande.findUnique({
        where: {
            id: demandeId,
            offreurId,
        }
    })
}


// PUT: update etat Demande
export const updateEtatDemande = async (demande: Omit<Demande, "id" | "title" | "description" | "date_emission" | "cc">, id: number): Promise<Demande> => {
    const { etat, motif_refus } = demande;
    return await db.demande.update({
        where: {
            id,
       },
        data: {
            etat,
            motif_refus,
        },
        select: {
            id: true,
            title: true,
            description: true,
            etat: true,
            motif_refus: true,
            cc: true,
            date_emission: true,
            offreur: true,
            demandeur: true,
            facture: true,
            rdv: true,
        },
    });
};

// Post : plan rdv
export const planRdv = async (rdv: Omit<Rdv, "id">, demandeId: number): Promise<Rdv> => {
    const { heure, date, address, link, type } = rdv;
    return await db.rdv.create({
        data: {
            heure,
            date,
            address,
            link,
            type,
            demandeId,
        },
        select: {
            id: true,
            heure: true,
            date: true,
            type: true,
            address: true,
            link: true,
        },
    });
};

// Post : generer facture
export const generateFacture = async (facture: Omit<Facture, "id">, demandeId: number): Promise<Facture> => {
    const { montant } = facture;
    return await db.facture.create({
        data: {
            montant,
            demandeId,
        },
        select: {
            id: true,
            montant: true,
            date_generation: true,
            demande: true,
        },
    });
};



