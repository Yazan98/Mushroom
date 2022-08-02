import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class GithubRepositoriesTagsManager extends DependencyManager {
    private readonly httpService;
    private readonly fileName;
    private readonly mode;
    private readonly cacheFile;
    private cachedLibraries;
    private cacheManager;
    constructor(httpService: HttpService, configService: ConfigService, fileName: string, mode: string, cacheFile: string);
    onImplementAction(event: string, message: Message): void;
    private onRepositoryRequest;
    private onUpdateMessageSend;
    private getLibraryUpdateMessage;
}
