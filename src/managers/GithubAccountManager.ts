import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { GithubUser } from '../models/GithubUser';
import { HttpService } from '@nestjs/axios';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ConfigService } from '@nestjs/config';

export class GithubAccountManager extends DependencyManager {
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    super(configService);
  }

  onImplementAction(event: string, message: Message) {
    this.httpService.axiosRef
      .get<GithubUser>('users/' + event, this.getRequestConfig())
      .then((result) => {
        message.reply(GithubAccountManager.getMessageBody(result.data));
      })
      .catch((ex) => {
        ApplicationUtils.printAppLog('Error : ' + ex);
        message.reply('Failed to Get User Information With Id : ' + event);
      });
  }

  private static getMessageBody(user: GithubUser): string {
    let response = '';
    response +=
      'Profile Information in Github is Available : ' + user.login + ' \n';
    response += 'Profile Name : ' + user.name + ' \n';
    if (user.company) {
      response += 'Profile Company : ' + user.company + ' \n';
    }

    if (user.location) {
      response += 'Profile Location : ' + user.location + ' \n';
    }

    if (user.blog) {
      response += 'Profile Website : ' + user.blog + ' \n';
    }

    if (user.twitter_username) {
      response += 'Profile Twitter : ' + user.twitter_username + ' \n';
    }
    response += 'Profile Followers : ' + user.followers + ' \n';
    response += 'Profile Followings : ' + user.following + ' \n';
    response += 'Profile Public Gists : ' + user.public_gists + ' \n';
    response += 'Profile Public Repos : ' + user.public_repos + ' \n';

    if (user.bio) {
      response += ' \n';
      response += 'Profile Description : ' + user.bio.trim() + ' \n';
    }

    return response;
  }
}
