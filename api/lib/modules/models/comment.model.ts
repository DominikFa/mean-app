export interface CommData {
    text: string;
    postId: string;
    userId: string;
    createdAt?: Date;
}

export type Query<T> = {
    [key: string]: T;
};