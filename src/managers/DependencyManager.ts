import { Message } from 'discord.js';
import axios, { Axios, AxiosRequestConfig } from 'axios';

export abstract class DependencyManager {
  abstract onImplementAction(event: string, message: Message);

  protected getRequestConfig(): AxiosRequestConfig {
    return {
      baseURL: 'https://api.github.com/',
      responseType: 'json',
      timeout: 5000,
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
      console.log('Google Starting Request', request.url);
      return request;
    });

    return instance;
  }
}
