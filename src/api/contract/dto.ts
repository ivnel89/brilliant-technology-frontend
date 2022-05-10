export class CreateCommentDto {
    content: string;
    authorId: string;
    articleId: string;
  }

  export class GetCommentsDto {
    userId: string;
    commentIds: Array<string>;
    articleId: string;
  }
  
  