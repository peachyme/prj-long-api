import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";

export type Skill = {
    id: number;
    label: string;
};

// GET: List of skills
export const listSKills = async (): Promise<Skill[]> => {
    return await db.skill.findMany({
        select: {
            id: true,
            label: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// GET: show skill
export const getSkill = async (id: number): Promise<Skill | null> => {
    return await db.skill.findUnique({
        where: {
            id,
        },
    });
};

// POST: create skill
export const createSkill = async (skill: Omit<Skill, "id">): Promise<Skill> => {
    const { label } = skill;
    return await db.skill.create({
        data: {
            label,
        },
        select: {
            id: true,
            label: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// PUT: update skill
export const updateSkill = async (skill: Omit<Skill, "id">, id: number): Promise<Skill> => {
    const { label } = skill;
    return await db.skill.update({
        where: {
            id,
        },
        data: {
            label,
        },
        select: {
            id: true,
            label: true,
        },
    });
};

// DELETE: delete skill
export const deleteSkill = async (id: number): Promise<Prisma.BatchPayload> => {
    return await db.skill.deleteMany({
            where: {
                id,
            },
    });
};

