import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
export declare class GithubRepositoryManager extends DependencyManager {
    private readonly httpService;
    constructor(httpService: HttpService);
    onImplementAction(event: string, message: Message): void;
}
