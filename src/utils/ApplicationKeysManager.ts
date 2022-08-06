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

  /**
   * While Running This Project on Local Env You Need to Set isLocalEnv to True
   * Else Set it to False to Read from The Container Json in Docker Container
   */
  static getFilePath(): string {
    const isLocalEnv = false;
    if (isLocalEnv) {
      return '/src/';
    } else {
      return '/app/src/';
    }
  }
}
