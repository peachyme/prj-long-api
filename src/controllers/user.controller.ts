import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { db } from "../utils/db.server";
import { sendVerificationEmail } from "../utils/nodemailer";
import { generateVerificationToken } from '../utils/jwt';

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
}

// POST: create user
export const createUser = async (user: Omit<User, "id">) : Promise<User> => {
    const { username, email, password, role } = user;

    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 12);

    // Generate a verification token
    const verificationToken = generateVerificationToken();

    const newUser = await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role,
            verificationToken
        },
    });

    // Create the verification link
    const verificationLink = `http://localhost:8080/api/auth/verify?token=${verificationToken}`;

    // Send the verification email
    sendVerificationEmail(user.email, verificationLink)
    .then(() => {
        console.log('Verification email sent successfully');
    })
    .catch((error) => {
        console.error('Error sending verification email:', error);
    });

    return newUser;
}

// GET : get user by id
export const getUserById = async (id: string): Promise<User | null> => {
    return await db.user.findUnique({
        where: {
            id,
        }
    })
}

// GET : get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
    return await db.user.findUnique({
        where: {
            email,
        }
    })
}

// GET : get user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
    return await db.user.findUnique({
        where: {
            username,
        }
    })
}

// verify email
export const verifyEmail = async (verificationToken: string): Promise<boolean> => {

    const user = await db.user.findUnique({
        where: {
            verificationToken,
        },
    });
    
    
    if (user) {
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: true,
                verificationToken: undefined, // Optionally, clear the verification token
            },
        });
        
        return true; // Verification successful
    }
    
    return false; // Verification failed
}

// reset password
export const resetPassword = async (id: string, newPassword: string): Promise<boolean> => {

    // hash the password
    const hashedPassword = bcrypt.hashSync(newPassword, 12);

    const user = await db.user.findUnique({
        where: {
            id,
        },
    });
    
    if (user) {
        await db.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return true; // reset successful
    }
    
    return false; // reset failed
}