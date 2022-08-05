import { Client, Message } from 'discord.js';
import { EventCommand } from '../models/EventCommand';
export interface ConfigurationServiceImplementation {
    getDiscordApplicationToken(): string;
    getCurrentSupportedServices(): Array<string>;
    getDiscordClient(): Client;
    executeClientsListeners(): any;
    getChannelsInformation(): any;
    getChannelNameById(id: string): string;
    executeDiscordListener(): any;
    onEventExecute(event: EventCommand, message: Message): any;
    generateJsonTemplates(): any;
}
