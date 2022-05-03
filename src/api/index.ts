import axios, { AxiosInstance } from 'axios'
import { Config } from '../config';
import { Article, Comment } from './contract';
import { CreateCommentDto } from './contract/dto';

class Api {
    private _client : AxiosInstance;
    private _config : Config;
    constructor(){
        this._config = new Config();
        this._client = axios.create({
          baseURL: this._config.variables.API_BASE_URL,
        });
    }
    async fetchAllArticles(): Promise<Array<Article>>{
        const response = await this._client.get<Array<Article>>('/article')
        return response.data
    }

    async fetchArticleById(id: string): Promise<Article>{
        const response = await this._client.get<Article>(`/article/${id}`)
        return response.data
    }

    async addComment(userId: string, articleId: string, content: string): Promise<Comment>{
        const data : CreateCommentDto = new CreateCommentDto();
        data.articleId = articleId;
        data.authorId = userId;
        data.content = content;
        const response = await this._client.post<Comment>(`/comment`, data);
        return response.data
    }
}

export default Api;