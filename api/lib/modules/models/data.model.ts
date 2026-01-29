export interface IData {
    title: string;
    text: string;
    image: string;
    userId: string;
    likes?: string[];
    views?: number;
}

export type Query<T> = {
    [key: string]: T;
};