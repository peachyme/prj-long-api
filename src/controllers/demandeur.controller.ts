import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";
import { User } from "./user.controller";

type Demandeur = {
    id: number;
    fname: string;
    lname: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    user: Omit<User, "email" | "password" | "role">;
};


// GET: List of Demandeurs
export const listDemandeurs = async (): Promise<Demandeur[]> => {
    return await await db.demandeur.findMany({
        select: {
            id: true,
            fname: true,
            lname: true,
            phone: true,
            email: true,
            address: true,
            country: true,
            city: true,
            zip: true,
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },

        },
    });
};

// GET: show Demandeur
export const getDemandeur = async (id: number): Promise<Demandeur | null> => {
    return await db.demandeur.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            phone: true,
            email: true,
            address: true,
            country: true,
            city: true,
            zip: true,
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
};

// POST: create Demandeur
export const createDemandeur = async (Demandeur: Omit<Demandeur, "id">, user: User): Promise<Demandeur> => {
    const { fname, lname, phone, address, country, city, zip } = Demandeur;
    return await db.demandeur.create({
        data: {
            fname,
            lname,
            phone,
            email: user.email,
            address,
            country,
            city,
            zip,
            userId: user.id,
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            phone: true,
            email: true,
            address: true,
            country: true,
            city: true,
            zip: true,
            user: {
                select: {
                    id: true,
                    username: true,
                },
            }
        }
    });
};

// PUT: update Demandeur
export const updateDemandeur = async (Demandeur: Omit<Demandeur, "id">, id: number): Promise<Demandeur> => {
    const { fname, lname, phone, address, country, city, zip } = Demandeur;
    return await db.demandeur.update({
        where: {
            id,
        },
        data: {
            fname,
            lname,
            phone,
            address,
            country,
            city,
            zip,
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            phone: true,
            email: true,
            address: true,
            country: true,
            city: true,
            zip: true,
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        }
    });
};

// DELETE: delete Demandeur
export const deleteDemandeur = async (id: number): Promise<void> => {
    await db.demandeur.delete({
        where: {
            id,
        },
    });
};

