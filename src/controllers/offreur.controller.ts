import { db } from "../utils/db.server";
import { User } from "./user.controller";

type Offreur = {
    id: number;
    fname: string;
    lname: string;
    apropos: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    user: Omit<User, "email" | "password" | "role">;
};

type OffreurSkill = {
    offreurId: number; 
    createdAt: Date; 
    updatedAt: Date; 
    skillId: number; 
    level: number;
};

type OffreurList = {
    id: number;
    fname: string;
    lname: string;
    apropos: string;
};

// GET: List of Offreurs
export const listOffreurs = async (): Promise<OffreurList[]> => {
    return db.offreur.findMany({
        select: {
            id: true,
            fname: true,
            lname: true,
            apropos: true,
            skills: {
                select: {
                    level: true,
                    skill: {
                        select: {
                            label: true,
                        }
                    }
                }
            },
            _count: {
                select: { evaluations: true }
            },
        },
    });
};

// GET: show Offreur
export const getOffreur = async (id: number): Promise<Offreur | null> => {
    return db.offreur.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            apropos: true,
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
            experiences: true,
            
            skills: {
                select: {
                    level: true,
                    skill: {
                        select: {
                            label: true,
                        }
                    }
                }
            },
            evaluations: true,
        },
    });
};

// GET: show Offreur
export const offreurHasSkill = async (offreurId: number, skillId: number): Promise<OffreurSkill | null> => {
    return db.offreurSkill.findUnique({
        where: {
            offreurId_skillId: {offreurId: offreurId, skillId: skillId},
        },
    });
};

// POST: create Offreur
export const createOffreur = async (offreur: Omit<Offreur, "id">, user: User): Promise<Offreur> => {
    const { fname, lname, apropos, phone, address, country, city, zip } = offreur;
    return db.offreur.create({
        data: {
            fname,
            lname,
            apropos,
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
            apropos: true,
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

// PUT: update Offreur
export const updateOffreur = async (offreur: Omit<Offreur, "id">, id: number): Promise<Offreur> => {
    const { fname, lname, apropos, phone, address, country, city, zip } = offreur;
    return db.offreur.update({
        where: {
            id,
        },
        data: {
            fname,
            lname,
            apropos,
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
            apropos: true,
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
            experiences: true,
            skills: true,
        }
    });
};

// DELETE: delete Offreur
export const deleteOffreur = async (id: number): Promise<void> => {
    await db.offreur.delete({
        where: {
            id,
        },
    });
};


// PUT: add skills to Offreur
export const addSkillsToOffreur = async (id: number, skillId: number, level: number): Promise<void> => {
    await db.offreur.update({
        where: {
            id,
        },
        data: {
            skills: {
                create: {
                      level,
                      skill: {
                        connect: {
                          id: skillId,
                        },
                      },
                    },
            }
        },
    });
};


// DELETE: add skills to Offreur
export const deleteSkillFromOffreur = async (offreurId: number, skillId: number): Promise<void> => {    
    await db.offreurSkill.delete({
        where: {
            offreurId_skillId: {offreurId: offreurId, skillId: skillId},
        },
    });
};

