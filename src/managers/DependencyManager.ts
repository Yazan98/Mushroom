import { Message } from 'discord.js';
import axios, { Axios, AxiosRequestConfig } from 'axios';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ApplicationKeysManager } from '../utils/ApplicationKeysManager';

export abstract class DependencyManager {
  public static FIREBASE_KEY = 'firebase';

  // Hardcoded Links
  public static FIREBASE_BASE_URL_DOCUMENTATION =
    'https://firebase.google.com/docs';
  public static RELEASE_NOTES_FIREBASE =
    'https://firebase.google.com/support/release-notes/android';

  abstract onImplementAction(event: string, message: Message);

  protected getRequestConfig(): AxiosRequestConfig {
    return {
      baseURL: 'https://api.github.com/',
      responseType: 'json',
      timeout: 5000,
      auth: {
        username: ApplicationKeysManager.getGithubUsername(),
        password: ApplicationKeysManager.getGithubToken(),
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

  protected static getFirebaseDocumentationUrl(artifact: string): string {
    if (artifact.includes('firestore')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/firestore';
    } else if (artifact.includes('crashlytics')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/crashlytics';
    } else if (artifact.includes('analytics')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/analytics';
    } else if (artifact.includes('ads')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/ads';
    } else if (artifact.includes('appindexing')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/appindexing';
    } else if (artifact.includes('auth')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/auth';
    } else if (artifact.includes('config')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/config';
    } else if (artifact.includes('database')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/database';
    } else if (artifact.includes('dynamic-links')) {
      return (
        DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/dynamic-links'
      );
    } else if (artifact.includes('functions')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/functions';
    } else if (artifact.includes('invites')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/invites';
    } else if (artifact.includes('messaging')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/messaging';
    } else if (artifact.includes('storage')) {
      return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/storage';
    } else {
      return 'UnKnown';
    }
  }
}
