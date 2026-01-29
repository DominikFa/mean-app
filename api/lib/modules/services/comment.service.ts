import CommModel from "../schemas/comment.schema";
import { CommData } from "../models/comment.model";


class CommentService {



    public async addComment(commData: CommData): Promise<void>  {
        try{
            const newComment = new CommModel(commData);
            await newComment.save();
        }
        catch(error){
             console.error('Wystąpił błąd podczas dodawania komentarza:', error);
             throw new Error(`Wystąpił błąd podczas dodawania komentarza: ${error}`);
        }
    }

    public async deleteById(id: string){

        try {
            await CommModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Błąd podczas usuwania komentarza o id ${id}: ${error}`);
        }
    }

    public async getById(id: string){

        try {
            return await CommModel.findById(id);
        } catch (error) {
            throw new Error(`Błąd podczas pobierania komentarza o id ${id}: ${error}`);
        }
    }
    public async getAllByPostId(postId: string){

        try {
            return await CommModel.find({postId: postId }).populate('userId', 'name');

        } catch (error) {
            throw new Error(`Błąd podczas pobierania komentarzy dla postu o id ${postId}: ${error}`);
        }
    }


}

export default CommentService;