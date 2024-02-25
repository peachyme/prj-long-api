import { Prisma } from "@prisma/client";
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
    city: string;
    zip: string;
    country: string;
};

type SearchOffreurCriteria = {
    fname?: string;
    lname?: string;
    skills?: string; // Assuming skills are searched by labels
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
  };

// GET: List of Offreurs
export const listOffreurs = async (): Promise<OffreurList[]> => {
    return await db.offreur.findMany({
        select: {
            id: true,
            fname: true,
            lname: true,
            apropos: true,
            country: true,
            city: true,
            zip: true,
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

// GET : search offreurs
export const searchOffreurs = async (criteria: SearchOffreurCriteria): Promise<OffreurList[]> => {
    const { fname, lname, skills, address, city, zip, country } = criteria;

    const skillsArray: string[] | undefined = skills ? skills.split(',') : undefined;
    const whereClause: Prisma.OffreurWhereInput = {};
  
    if (fname) whereClause.fname = { contains: fname };
    if (lname) whereClause.lname = { contains: lname };
    if (skillsArray) {
        whereClause.skills = {
          some: {
            skill: {
              label: { in: skillsArray },
            },
          },
        };
      }  
    if (address) whereClause.address = { contains: address };
    if (city) whereClause.city = { contains: city };
    if (zip) whereClause.zip = { contains: zip };
    if (country) whereClause.country = { contains: country };
  
    return await db.offreur.findMany({
      where: whereClause,
      select: {
        id: true,
        fname: true,
        lname: true,
        apropos: true,
        country: true,
        city: true,
        zip: true,
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
    return await db.offreur.findUnique({
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
            projets: {
                select: {
                    taches: true,
                }
            },
        },
    });
};

// GET: show Offreur
export const offreurHasSkill = async (offreurId: number, skillId: number): Promise<OffreurSkill | null> => {
    return await db.offreurSkill.findUnique({
        where: {
            offreurId_skillId: {offreurId: offreurId, skillId: skillId},
        },
    });
};

// POST: create Offreur
export const createOffreur = async (offreur: Omit<Offreur, "id">, user: User): Promise<Offreur> => {
    const { fname, lname, apropos, phone, address, country, city, zip } = offreur;
    return await db.offreur.create({
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
    return await db.offreur.update({
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

