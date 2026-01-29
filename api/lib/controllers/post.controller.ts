import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import {checkPostCount} from "../middlewares/checkPostCount.middleware";
import DataService from '../modules/services/data.service';
import { authMiddleware } from '../middlewares/auth.middleware';

class PostController implements Controller {
   public path = '/api/post';
   public router = Router();
   private dataService: DataService;

   constructor() {
       this.dataService = new DataService();
       this.initializeRoutes();
   }

   private initializeRoutes() {

       /////// GET

       this.router.get(`${this.path}s`, this.getAll);
       this.router.get(`${this.path}/:id`, this.getElementById);
       this.router.get(`${this.path}/likes/:id`, this.getLikes);

       /////// POST

       this.router.post(`${this.path}`, authMiddleware, this.addData);
       this.router.post(`${this.path}/like/:id`, authMiddleware, this.toggleLike);

       /////// PUT

       this.router.put(`${this.path}/:id`, authMiddleware, this.updatePost);


       /////// DELETE

       this.router.delete(`${this.path}/:id`, authMiddleware, this.removePost);
       this.router.delete(`${this.path}s`, authMiddleware, this.deleteAll);
   }




    /////// GET

    private getAll = async (request: Request, response: Response, next: NextFunction) => {

        try {
            const post = await this.dataService.query({});
            response.status(200).json(post);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    };


    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const incrementViews = request.query.incrementViews === 'true';


        try {
            const post = await this.dataService.getById(id, incrementViews);
            response.status(200).json(post);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    }

    private getLikes = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            const likes = await this.dataService.getLikes(id);
            response.status(200).json(likes);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    };

    /////// PUT

    private updatePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { title, text, image } = request.body;
        const userId = (request as any).user.userId;

        try {
            const post = await this.dataService.getById(id);
            if (!post) return response.status(404).json({ error: 'Post not found' });
            if (post.userId.toString() !== userId) return response.status(403).json({ error: 'Unauthorized' });

            const updatedData = { title, text, image };
            await this.dataService.updatePost(id, updatedData);
            response.status(200).json(updatedData);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    };


    /////// POST

    private addData = async (request: Request, response: Response, next: NextFunction) => {

        const {title, text, image} = request.body;

        const userId = (request as any).user.userId;

        const Data = {
            title,
            text,
            image,
            userId
        };

        try {
            await this.dataService.createPost(Data);
            response.status(200).json(Data);
        } catch (error) {
            console.log('eeee', error)

            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: error.message });
        }
    }

    private toggleLike = async (request: Request, response: Response, next: NextFunction) => {

        const { id } = request.params;
        const userId = (request as any).user.userId;

        try {
            const updatedLikes = await this.dataService.toggleLike(id, userId);
            if(updatedLikes){
                response.status(200).json(updatedLikes);
            }
            else{
                response.status(403).json({info:"Nie można likować włąsnych postów"});
            }
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    };


    /////// DELETE

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {

        const userId = (request as any).user.userId;

        try {
            await this.dataService.deleteAllPosts(userId);
            response.sendStatus(200);
        } catch (error) {
             response.status(500).json({ error: error.message });
        }
    };


    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const userId = (request as any).user.userId;

        try {
            const post = await this.dataService.getById(id);

            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }

            if (post.userId.toString() !== userId) {
                return response.status(403).json({ error: 'You are not authorized to delete this post' });
            }

            await this.dataService.deleteById(id);
            response.status(200).json({ message: 'Post deleted' });

        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    };
}

export default PostController;