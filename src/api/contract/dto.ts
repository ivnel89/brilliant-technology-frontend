export class CreateCommentDto {
    content: string;
    authorId: string;
    articleId: string;
    parentCommentId?: string;
  }

  export class GetCommentsDto {
    userId: string;
    commentIds: Array<string>;
    articleId: string;
  }
  
  export class CreateUserDto {
    firstName: string;
    lastName: string;
    displayPicture: string;
  }

  export class CreateArticleDto {
    content: string; 
    authorId: string;
}