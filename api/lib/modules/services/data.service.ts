import {IData, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
    public async createPost(postParams: IData) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async updatePost(id: string, postParams: Partial<IData>){
        try {
            const updatedPost = await PostModel.findByIdAndUpdate(
                id,
                { $set: postParams },
                { new: true }
            );

            return updatedPost;

        } catch (error) {
            console.error(`Bąd podczas edycji posta o id ${id}: ${error}`);
            throw new Error(`Bąd podczas edycji posta o id ${id}: ${error}`);
        }

    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0});
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getById(id: string, incrementView: boolean = false) {
        try {

            if (incrementView) {
                return await PostModel.findByIdAndUpdate(
                    id,
                    { $inc: { views: 1 } },
                    { new: true, fields: { __v: 0 } }
                );
            }
            return await PostModel.findById(id, { __v: 0 });
        } catch (error) {
            throw new Error(`Błąd podczas pobierania posta o id ${id}: ${error}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error(`Wystąpił błąd podczas usuwania danych: ${error}`);
        }
    }
    public async deleteById(id: string) {
        try {
            await PostModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Błąd podczas usuwania posta o id ${id}: ${error}`);
        }
    }

    public async deleteAllPosts(userId: string){
        try {
            await PostModel.deleteMany({userId: userId});
        } catch (error) {
            throw new Error(`Błąd podczas usuwania wszystkich postów: ${error}`);
        }
    }

    public async toggleLike(postId: string, userId: string) {
        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new Error('Post nie znaleziony');
            }


            if(userId.toString() !== post.userId.toString()){

                const index = post.likes.findIndex(id => id.toString() === userId);


                if (index === -1) {

                    post.likes.push(userId as any);
                } else {
                    post.likes.splice(index, 1);
                }
            }
            else{
                return false;
            }

            await post.save();
            return post.likes;
        } catch (error) {
            throw new Error(`Błąd podczas like'owania: ${error}`);
        }
    }

    public async getLikes(postId: string) {
        try {
            const post = await PostModel.findById(postId, { likes: 1 });
            if (!post) throw new Error('Post nie znaleziony');
            return post.likes;
        } catch (error) {
            throw new Error(`Błąd pobierania like'ów: ${error}`);
        }
    }

}

export default DataService;