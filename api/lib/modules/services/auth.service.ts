import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import UserModel from "../schemas/user.schema";
import { UserData } from "../models/user.model";
import { config } from "../../config";
import TokenBlacklist from "../schemas/token.blacklist.schema";

class AuthService {

    public async createUser(userData: UserData): Promise<void> {
        try{
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await this.hashPassword(userData.password);
            const newUser = new UserModel({
                ...userData,
                password: hashedPassword
            });
            await newUser.save();
        }
        catch (error){
            console.error(error)
            throw new Error(`Wystąpił błąd podczas rejestracji: ${error}`);
        }
    }



    public async authenticate(credentials: any): Promise<any | null> {
        try{
            const user = await UserModel.findOne({ email: credentials.login });
            if (!user) {
                return null;
            }

            const isPasswordValid = await this.verifyPassword(user.password, credentials.password);
            if (!isPasswordValid) {
                return null;
            }

            return this.generateTokens(user);
        }
        catch (error){
            console.error(error)
            throw new Error(`Wystąpił błąd podczas logowania: ${error}`);
        }
    }

    private generateTokens(user: any): any {
        const data = {
            userId: user._id,
            email: user.email,
            name: user.name
        };

        const accessToken = jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiration as any});
        const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiration as any});

        return { token: accessToken, refreshToken };
    }

    private async hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    private async verifyPassword(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

    public async refreshToken(token: string): Promise<any | null> {
        try {

            const isRevoked = await this.isTokenRevoked(token);
            if(isRevoked){
                throw new Error('Token has been revoked');
            }
            const decoded: any = jwt.verify(token, config.jwtRefreshSecret);
            const user = await UserModel.findById(decoded.userId);

            if (!user) {
                return null;
            }

            return this.generateTokens(user);
        } catch (error) {
             console.error(error)
             throw new Error(`Wystąpił błąd podczas odświeżania JWT: ${error}`);
        }
    }
    public async revokeToken(token: string, refreshToken?: string): Promise<void> {
        try {
            await TokenBlacklist.create({ token: token });

            if(refreshToken){
                await TokenBlacklist.create({ token: refreshToken });
            }

        } catch (error) {
            console.error(error)
            throw new Error(`Wystąpił Błąd: ${error}`);
        }
    }

    public async isTokenRevoked(token: string): Promise<boolean> {
        try {
            const found = await TokenBlacklist.findOne({ token });
            return !!found;
        }
        catch (error){

        }

    }


}

export default AuthService;