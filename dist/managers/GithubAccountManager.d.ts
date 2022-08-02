import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
export declare class GithubAccountManager extends DependencyManager {
    private readonly httpService;
    constructor(httpService: HttpService);
    onImplementAction(event: string, message: Message): void;
    private static getMessageBody;
}
