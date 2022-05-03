import axios, { AxiosInstance } from 'axios'
import { Config } from '../config';
import { CustomEventKey } from '../helper/customEventKey';
import { setUserId } from '../helper/getUserId';
import { Article, Comment, User } from './contract';
import { CreateCommentDto } from './contract/dto';
import * as $ from "jquery";
import { setUser } from '../helper/getUser';

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

    async fetchUsers(offset=0, limit=10): Promise<Array<User>>{
        const response = await this._client.get<Array<User>>(`/user`,{
            params:{
                offset,
                limit
            }
        });
        return response.data
    }

    async getRandomUser(): Promise<User>{
        const users = await this.fetchUsers();
        return users[Math.floor(Math.random()*users.length)];
    }

    async login(){
        const user = await this.getRandomUser()
        setUserId(user.id);
        setUser(user);
        $(document).trigger(CustomEventKey.LOGIN)
    }
}

export default Api;