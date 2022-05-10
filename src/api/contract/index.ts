export interface Article {
    id: string;
    content: string;
    author: User;
    createdDate: Date;
    comments: Array<Comment>
}

export interface User {
    id: string
    firstName: string;
    lastName: string;
    displayPicture: string;
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    createdDate: Date;
    upVotes: number;
    upVoted: boolean;
    replies: Array<Comment>
}