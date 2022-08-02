import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepository } from '../models/GithubRepository';
import { ConfigService } from '@nestjs/config';
export declare class GithubAccountRepositoriesManager extends DependencyManager {
    private readonly httpService;
    constructor(httpService: HttpService, configService: ConfigService);
    onImplementAction(event: string, message: Message): void;
    static getMessageBody(repository: GithubRepository): string;
}
