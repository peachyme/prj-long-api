import express from "express";
import type { Response, Request, NextFunction } from "express";
import { generateAccessToken, generateResetToken } from "../utils/jwt";
import { addAccessToken, deleteAccessToken } from "../controllers/auth.controller";
import { createUser, getUserByEmail, getUserById, getUserByUsername, resetPassword, verifyEmail } from "../controllers/user.controller";
import { body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { isAuthenticated } from "../middleware";
import { sendResetPasswordEmail } from "../utils/nodemailer";
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

// POST: register
// params : username, email, password, role
authRouter.post('/register', body("username").isString(), body("email").isEmail(), async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, username, role } = request.body;
        if (!email || !password || !username) {
        return response.status(400).json('You must provide a username, an email and a password.');
        }

        const existingEmail = await getUserByEmail(email);

        if (existingEmail) {
            return response.status(400).json('Email already in use.');
        }

        const existingUsername = await getUserByUsername(username);

        if (existingUsername) {
            return response.status(400).json('Username already in use.');
        }

        const user = await createUser({ username, email, password, role });
        const accessToken = generateAccessToken(user);
        await addAccessToken(accessToken, user.id);


        return response.status(201).json({user, accessToken, message: 'User registered successfully. Check your email for verification.'});
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: login
// params : username, password
authRouter.post('/login', body("username").isString(), async (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = request.body;
        if (!username || !password) {
            return response.status(400).json('You must provide a username and a password.');
        }

        const existingUsername = await getUserByUsername(username);

        if (!existingUsername) {
            return response.status(400).json('Invalid login credentials.');
        }

        const validPassword = await bcrypt.compare(password, existingUsername.password);
        if (!validPassword) {
            return response.status(403).json('Invalid login credentials.');
        }

        const accessToken = generateAccessToken(existingUsername);
        await addAccessToken(accessToken, existingUsername.id);

        return response.status(200).json({
            accessToken,
        });
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST: logout
authRouter.post('/logout', isAuthenticated, async (request: Request, response: Response) => {
    try {
        const id = request.payload ? request.payload.id : null;

        await deleteAccessToken(id);
        return response.status(200).json({ message: 'Logout successful' });
    } catch (error: any) {
        return response.status(500).json({ error: error.message });
    }
});


// GET: verify email
authRouter.get('/verify', async (request: Request, response: Response) => {
    const { token } = request.query;

    if (!token) {
        return response.status(400).json('Invalid verification link.');
    }
  
    const verificationResult = await verifyEmail(token as string);
  
    if (verificationResult) {
        return response.status(200).json('Email successfully verified.');
    } else {
        return response.status(400).json('Invalid verification link.');
    }
});



// POST : forgot password
authRouter.post('/forgot-password', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { email } = request.body;

        const user = await getUserByEmail(email);

        if (!user) {
            return response.status(404).json('User not found');
        }

        const resetToken = generateResetToken(user);

        const resetPasswordLink = `http://localhost:8080/api/auth/reset-password?token=${resetToken}`;

        sendResetPasswordEmail(user.email, resetPasswordLink)
        .then(() => {
            response.status(200).json('Reset password email sent successfully');
        })
        .catch((error) => {
            response.status(404).json({'Error sending reset password email:': error});
        });

    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// POST : reset password
authRouter.post('/reset-password', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { newPassword } = request.body;
        const { token } = request.query;
        // Verify the resetToken
        const decodedToken: any = jwt.verify(token as string, process.env.JWT_RESET_SECRET as string);
        
        
    
        // Fetch user from the database based on the userId in the decodedToken
        const user = await getUserById(decodedToken.userId);
    
        if (!user) {
          return response.status(404).json('User not found');
        }
    
        // Update user's password in the database
        const reset = await resetPassword(user.id, newPassword);
  
        if (reset) {
            return response.status(200).json('Password reset successfully.');
        } else {
            return response.status(400).json('Invalid reset link.');
        }
    
    } catch (error: any) {
        return response.status(500).json({ error: error.message });
    }   
});
