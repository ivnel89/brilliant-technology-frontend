
export interface ConfigVariables {
    API_BASE_URL: string
}

export class Config{
    private API_BASE_URL: string = process.env['API_BASE_URL'];

    get variables(): ConfigVariables{
        return {
            API_BASE_URL: this.API_BASE_URL
        }
    }
}