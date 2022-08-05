import { Client, Message } from 'discord.js';
import { EventCommand } from '../models/EventCommand';

export interface ConfigurationServiceImplementation {
  getDiscordApplicationToken(): string;

  getCurrentSupportedServices(): Array<string>;

  getDiscordClient(): Client;

  executeClientsListeners();

  getChannelsInformation();

  getChannelNameById(id: string): string;

  executeDiscordListener();

  onEventExecute(event: EventCommand, message: Message);

  generateJsonTemplates();
}
