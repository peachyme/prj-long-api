import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";

type Experience = {
    id: number;
    title: string;
    description: string;
    link: string;
    from: string;
    to: string;
    offreurId: number;
};

// GET: List of Experiences
export const listExperiences = async (offreurId: number): Promise<Experience[]> => {
    return db.experience.findMany({
        where: {
            offreurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            link: true,
            from: true,
            to: true,
            offreurId: true,
        },
    });
};

// GET: show Experience
export const getExperience = async (id: number): Promise<Experience | null> => {
    return db.experience.findUnique({
        where: {
            id,
        },
    });
};

// POST: create Experience
export const createExperience = async (experience: Omit<Experience, "id">, offreurId: number): Promise<Experience> => {
    const { title, description, link, from, to } = experience;

    return db.experience.create({
        data: {
            title,
            description,
            link,
            from,
            to,
            offreurId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            link: true,
            from: true,
            to: true,
            offreurId: true,
        },
    });
};

// PUT: update Experience
export const updateExperience = async (experience: Omit<Experience, "id">, id: number): Promise<Experience> => {
    const { title, description, link, from, to } = experience;
    return db.experience.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            link,
            from, 
            to,
        },
        select: {
            id: true,
            title: true,
            description: true,
            link: true,
            from: true,
            to: true,
            offreurId: true,
        },
    });
};

// DELETE: delete Experience
export const deleteExperience = async (id: number): Promise<Prisma.BatchPayload> => {
    return await db.experience.deleteMany({
        where: {
            id,
        },
    });
};

