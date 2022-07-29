export interface ConfigurationServiceImplementation {
  getSlackApplicationToken(): string;

  getDiscordApplicationToken(): string;

  getCurrentSupportedServices(): Array<string>;
}
