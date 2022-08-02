import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepository } from '../models/GithubRepository';
import { GithubAccountRepositoriesManager } from './GithubAccountRepositoriesManager';
import { ApplicationUtils } from '../utils/ApplicationUtils';

export class GithubRepositoryManager extends DependencyManager {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  onImplementAction(event: string, message: Message) {
    this.httpService.axiosRef
      .get<GithubRepository>('repos/' + event, this.getRequestConfig())
      .then((result) => {
        message.reply(
          GithubAccountRepositoriesManager.getMessageBody(result.data),
        );
      })
      .catch((ex) => {
        ApplicationUtils.printAppLog('Error : ' + ex);
        message.reply('Failed to Get User Information With Id : ' + event);
      });
  }
}
