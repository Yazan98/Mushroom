import { Message } from 'discord.js';
import { Axios, AxiosRequestConfig } from 'axios';
export declare abstract class DependencyManager {
    static FIREBASE_KEY: string;
    static FIREBASE_BASE_URL_DOCUMENTATION: string;
    static RELEASE_NOTES_FIREBASE: string;
    abstract onImplementAction(event: string, message: Message): any;
    protected getRequestConfig(): AxiosRequestConfig;
    getGoogleMavenRepositoriesInstance(): Axios;
    protected static getFirebaseDocumentationUrl(artifact: string): string;
}
