import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
export declare class GithubRepositoriesTagsManager extends DependencyManager {
    private readonly httpService;
    private readonly fileName;
    private readonly mode;
    private readonly cacheFile;
    private cachedLibraries;
    private cacheManager;
    constructor(httpService: HttpService, fileName: string, mode: string, cacheFile: string);
    onImplementAction(event: string, message: Message): void;
    private onRepositoryRequest;
    private onUpdateMessageSend;
    private getLibraryUpdateMessage;
}
