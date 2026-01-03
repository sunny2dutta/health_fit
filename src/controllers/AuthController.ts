import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { AppError } from '../utils/AppError.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { credential } = req.body;

            if (!credential) {
                throw new AppError("Missing credential", 400);
            }

            // Verify Google Token
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload) {
                throw new AppError("Invalid token payload", 401);
            }

            const { email } = payload;

            if (!email) {
                throw new AppError("Email not found in token", 400);
            }

            // Check if user exists, or create one
            let user = await this.userRepository.findByEmail(email);

            if (!user) {
                user = await this.userRepository.createUser(email);
            }

            // Generate JWT (optional, or just return user info if using simple session/localstorage on client)
            // For now, we'll return the user info and a session token.
            const token = jwt.sign(
                { id: user.id, email: user.email_id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '7d' }
            );

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email_id
                }
            });

        } catch (error) {
            console.error("Google Auth Error:", error);
            next(error);
        }
    };
}
