import { Message } from 'discord.js';
import { Axios, AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
export declare abstract class DependencyManager {
    private readonly configService;
    constructor(configService: ConfigService);
    abstract onImplementAction(event: string, message: Message): any;
    protected getRequestConfig(): AxiosRequestConfig;
    getGoogleMavenRepositoriesInstance(): Axios;
}
