import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import CommentService from '../modules/services/comment.service';
import { authMiddleware } from '../middlewares/auth.middleware';

class CommentController implements Controller {
   public path = '/api/posts';
   public router = Router();
   private commentService: CommentService;
   constructor() {
       this.commentService = new CommentService();
       this.initializeRoutes();
   }

   private initializeRoutes() {

       /////// GET

       this.router.get(`${this.path}/:postId/comments`, this.getCommentsByPost);



       /////// POST

       this.router.post(`${this.path}/:postId/comments`, authMiddleware, this.addComment);





       /////// DELETE

       this.router.delete(`${this.path}/comments/:id`, authMiddleware, this.deleteComment);

   }


    private addComment = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const userId = (request as any).user.userId;
            const { postId } = request.params;
            const { text } = request.body;

            const newComment = { text, postId, userId };
            const savedComment = await this.commentService.addComment(newComment);

            response.status(200).json(savedComment);
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

      private deleteComment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const userId = (request as any).user.userId;

            const comment = await this.commentService.getById(id)

            if (!comment) return response.status(404).json({ message: 'Comment not found' });

            if (comment.userId.toString() === userId){
                await this.commentService.deleteById(id);
                response.status(200).json({ message: 'Komentarz usunięty' });
            }
            else{
                return response.status(403).json({ message: 'Nie możesz usuwać czyichś komentarzy' });
            }

        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
    private getCommentsByPost = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { postId } = request.params;
            const comments = await this.commentService.getAllByPostId(postId);

            response.status(200).json(comments);
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}




export default CommentController;