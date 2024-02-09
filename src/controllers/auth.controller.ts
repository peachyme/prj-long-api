import { db } from "../utils/db.server";
import { Prisma } from '@prisma/client';



type AccessToken = {
  id: string;
  token: string;
  userId: string;
  revoked?: boolean;
}

// POST: create access token
export const addAccessToken = async (accessToken: string, userId: string): Promise<Omit<AccessToken, "revoked">> => {
    return await db.accessToken.create({
        data: {
            token: accessToken,
            userId,
        }
    })
}

// GET: get access token
export const getAccessToken = async (token: string) : Promise<AccessToken | null> => {
    return await db.accessToken.findUnique({
        where: {
            token: token,
        }
    })
}

// delete access token : PUT: cuz we're in fact only updating the revoked field
export const deleteAccessToken = async (id: string) : Promise<AccessToken> => {
    return await db.accessToken.delete({
        where: {
            id,
        }
    })
}

// revoke all user tokens
export const deleteAllAccessTokens = async (userId: string): Promise<Prisma.BatchPayload> => {
    return await db.accessToken.deleteMany({
        where: {
            userId,
        }
    })
}



