import { Message } from 'discord.js';
import axios, { Axios, AxiosRequestConfig } from 'axios';
import { ApplicationUtils } from '../utils/ApplicationUtils';

export abstract class DependencyManager {
  abstract onImplementAction(event: string, message: Message);

  protected getRequestConfig(): AxiosRequestConfig {
    return {
      baseURL: 'https://api.github.com/',
      responseType: 'json',
      timeout: 5000,
      auth: {
        username: process.env.GITHUB_CLIENT_NAME,
        password: process.env.GITHUB_SECRETE,
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
