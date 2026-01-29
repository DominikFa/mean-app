import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import AuthService from '../modules/services/auth.service';
import { authMiddleware } from '../middlewares/auth.middleware';

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.post(`${this.path}/create`, this.createNewUser);
        this.router.post(`${this.path}/refresh`, this.refresh);
        this.router.delete(`${this.path}/logout`, this.logout);
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const {login, password} = request.body;

        const credentials = {
            login,
            password
        };

        try {
            const result = await this.authService.authenticate(credentials);
            if (result) {
                response.status(200).json(result);
            } else {
                response.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            console.log(error.message);
            response.status(500).json({ error: error.message });
        }
    };

    private refresh = async (request: Request, response: Response, next: NextFunction) => {
        const { refreshToken } = request.body;
        if (!refreshToken) {
            return response.status(400).json({ error: 'Refresh Token is required' });
        }

        try {
            const result = await this.authService.refreshToken(refreshToken);
            if (result) {
                response.status(200).json(result);
            } else {
                response.status(401).json({ error: 'Invalid or expired Refresh Token' });
            }
        } catch (error) {
            console.log(error.message);
            response.status(500).json({ error: error.message });
        }
    };

    private createNewUser = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;

        try {
            await this.authService.createUser(userData);
            response.status(200).json({ message: 'User created successfully' });
        } catch (error) {
            console.log(error.message);
            response.status(500).json({ error: error.message });
        }
    };

    private logout = async (request: Request, response: Response, next: NextFunction) => {

        const accessToken = request.headers['x-auth-token'] as string;
        const { refreshToken } = request.body;

        try{

            if (accessToken) {
                const cleanToken = accessToken.startsWith('Bearer ') ? accessToken.split(' ')[1] : accessToken;
                await this.authService.revokeToken(cleanToken);
            }
            if (refreshToken){
                await this.authService.revokeToken(refreshToken);
            }

            response.status(200).send();
        }
        catch (error){
            console.log(error.message);
            response.status(500).json({ error: "failed to revoke tokens" });
        }

    };
}

export default UserController;