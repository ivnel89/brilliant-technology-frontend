import axios, { AxiosInstance } from 'axios'
import { Config } from '../config';
import { CustomEventKey } from '../helper/customEventKey';
import { getUserId, setUserId } from '../helper/getUserId';
import { Article, Comment, User } from './contract';
import { CreateCommentDto, GetCommentsDto } from './contract/dto';
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
        const response = await this._client.get<Article>(`/article/${id}`,{
            params:{
                requesterId: getUserId()
            }
        })
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

    async upVote(id: string): Promise<Comment>{
        const response = await this._client.put<Comment>(
          `/comment/${id}/upvote/add`,
          {
            userId: getUserId(),
          }
        );
        return response.data
    }

    async downVote(id: string): Promise<Comment>{
        const response = await this._client.put<Comment>(`/comment/${id}/upvote/remove`,{
   
                userId: getUserId()
            
        });
        return response.data
    }

    async getCommentsById(id: Array<string>): Promise<Array<Comment>>{
        const data = new GetCommentsDto()
        data.commentIds = id;
        data.userId = getUserId()
        const response = await this._client.get<Array<Comment>>(`/comment`,{
            params:data
        });
    return response.data
    }

    async getCommentsByArticleId(id: string): Promise<Array<Comment>>{
        const data = new GetCommentsDto()
        data.articleId = id;
        data.userId = getUserId()
        const response = await this._client.get<Array<Comment>>(`/comment`,{
            params:data
        });
    return response.data
    }
}

export default Api;