import { GithubManager } from './GithubManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepository } from './GithubRepository';
import { GithubAccountRepositoriesManager } from './GithubAccountRepositoriesManager';

export class GithubRepositoryManager extends GithubManager {
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
        console.log('Error : ' + ex);
        message.reply('Failed to Get User Information With Id : ' + event);
      });
  }
}
