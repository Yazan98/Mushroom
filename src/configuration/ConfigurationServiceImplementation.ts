import { Client, Message } from 'discord.js';

export interface ConfigurationServiceImplementation {
  getSlackApplicationToken(): string;

  getDiscordApplicationToken(): string;

  getCurrentSupportedServices(): Array<string>;

  getDiscordClient(): Client;

  executeDiscordClientListeners();

  generateJsonTemplates(isForceGenerate: boolean);
}
