import { Client, Message } from 'discord.js';
import { EventCommand } from '../models/EventCommand';

export interface ConfigurationServiceImplementation {
  getSlackApplicationToken(): string;

  getDiscordApplicationToken(): string;

  getCurrentSupportedServices(): Array<string>;

  getDiscordClient(): Client;

  executeClientsListeners();

  getChannelsInformation();

  getChannelNameById(id: string): string;

  executeDiscordListener();

  onEventExecute(event: EventCommand, message: Message);

  executeSlackListener();

  generateJsonTemplates();
}
