import { db } from "../utils/db.server";


// add a memeber to the project (offreur)
export const addMembre = async (membreId: number, id: number, role: string): Promise<void> => {
    await db.projet.update({
        where: {
            id,
        },
        data: {
            membres: {
                create: {
                      role,
                      offreur: {
                        connect: {
                          id: membreId,
                        },
                      },
                    },
            }
        },
    });
};


// delte project memeber (offreur)
export const removeMembre = async (projetId: number, offreurId: number): Promise<void> => {    
    await db.membreProjet.delete({
        where: {
            offreurId_projetId: {offreurId, projetId},
        },
    });
};