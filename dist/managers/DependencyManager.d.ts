import { Message } from 'discord.js';
import { Axios, AxiosRequestConfig } from 'axios';
export declare abstract class DependencyManager {
    abstract onImplementAction(event: string, message: Message): any;
    protected getRequestConfig(): AxiosRequestConfig;
    getGoogleMavenRepositoriesInstance(): Axios;
}
