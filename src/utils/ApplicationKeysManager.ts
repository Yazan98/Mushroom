export class ApplicationKeysManager {
  static getDiscordToken(): string {
    return '';
  }

  static getSupportedPlatforms(): string {
    return 'discord';
  }

  static getGithubUsername(): string {
    return 'Yazan98';
  }

  static getGithubToken(): string {
    return '';
  }

  static getFilePath(): string {
    const isLocalEnv = process.env.IS_LOCAL_DEV;
    if (!isLocalEnv) {
      return '/src/';
    } else {
      return '/app/src/';
    }
  }
}
