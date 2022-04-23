import axios, { AxiosInstance } from 'axios'
import { Config } from '../config';
import { Article } from './contract';

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
}

export default Api;