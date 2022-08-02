import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class GithubAccountManager extends DependencyManager {
    private readonly httpService;
    constructor(httpService: HttpService, configService: ConfigService);
    onImplementAction(event: string, message: Message): void;
    private static getMessageBody;
}
