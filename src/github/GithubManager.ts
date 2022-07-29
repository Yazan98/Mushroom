import { Message } from 'discord.js';
import { AxiosRequestConfig } from 'axios';

export abstract class GithubManager {
  abstract onImplementAction(event: string, message: Message);

  protected getRequestConfig(): AxiosRequestConfig {
    return {
      baseURL: 'https://api.github.com/',
      responseType: 'json',
      timeout: 5000,
    };
  }
}
