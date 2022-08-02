import { Message } from 'discord.js';
import axios, { Axios, AxiosRequestConfig } from 'axios';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ConfigService } from '@nestjs/config';

export abstract class DependencyManager {
  constructor(private readonly configService: ConfigService) {}

  abstract onImplementAction(event: string, message: Message);

  protected getRequestConfig(): AxiosRequestConfig {
    return {
      baseURL: 'https://api.github.com/',
      responseType: 'json',
      timeout: 5000,
      auth: {
        username: this.configService.get('GITHUB_CLIENT_NAME'),
        password: this.configService.get('GITHUB_SECRETE'),
      },
    };
  }

  public getGoogleMavenRepositoriesInstance(): Axios {
    const instance = axios.create({
      timeout: 5000,
      baseURL: 'https://dl.google.com',
      responseType: 'text',
      headers: { Accept: 'application/xml' },
    });

    instance.interceptors.request.use((request) => {
      ApplicationUtils.printAppLog('Google Starting Request : ' + request.url);
      return request;
    });

    return instance;
  }
}
