import { GithubManager } from './GithubManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepository } from './GithubRepository';

export class GithubAccountRepositoriesManager extends GithubManager {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  onImplementAction(event: string, message: Message) {
    this.httpService.axiosRef
      .get<GithubRepository[]>(
        'users/' + event + '/repos',
        this.getRequestConfig(),
      )
      .then((result) => {
        const response = result.data;
        message.reply('=========== Repositories Started ===========');
        for (let i = 0; i < response.length; i++) {
          message.reply(
            GithubAccountRepositoriesManager.getMessageBody(response[i]),
          );
        }

        message.reply('=========== Repositories Finished ===========');
      })
      .catch((ex) => {
        console.log('Error : ' + ex);
        message.reply('Failed to Get User Information With Id : ' + event);
      });
  }

  private static getMessageBody(repository: GithubRepository): string {
    let response = '';
    if (repository.name) {
      response +=
        'Repository Information Available for : ' + repository.name + '\n';
    }

    if (repository.description) {
      response +=
        'Repository Description : ' + repository.description.trim() + '\n';
    }

    response += 'Repository Full Name : ' + repository.full_name + '\n';

    if (repository.fork) {
      response += 'Repository Forked' + '\n';
    }

    if (repository.html_url) {
      response += 'Repository Url : ' + repository.html_url + '\n';
    }

    if (repository.stargazers_count) {
      response += 'Stars : ' + repository.stargazers_count + '\n';
    }

    if (repository.watchers_count) {
      response += 'Watchers : ' + repository.watchers_count + '\n';
    }

    if (repository.language) {
      response += 'Language : ' + repository.language + '\n';
    }

    if (repository.open_issues) {
      response += 'Open Issues : ' + repository.open_issues + '\n';
    }

    if (repository.default_branch) {
      response += 'Branch : ' + repository.default_branch + '\n';
    }
    return response;
  }
}
