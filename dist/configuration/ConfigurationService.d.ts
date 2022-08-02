import { ConfigurationServiceImplementation } from './ConfigurationServiceImplementation';
import { Client, Message } from 'discord.js';
import { ChannelModel } from '../models/ChannelModel';
import { EventCommand } from '../models/EventCommand';
import { HttpService } from '@nestjs/axios';
import { ChannelEvent } from '../models/ChannelEvent';
export declare class ConfigurationService implements ConfigurationServiceImplementation {
    private readonly httpService;
    static ANDROID_JSON_FILE: string;
    static ANDROID_CACHE_JSON_FILE: string;
    static BACKEND_JSON_FILE: string;
    static BACKEND_CACHE_JSON_FILE: string;
    static GENERAL_JSON_FILE: string;
    static GENERAL_CACHE_JSON_FILE: string;
    static CHANNELS_JSON_FILE: string;
    private eventsManager;
    private discordClient;
    private channels;
    constructor(httpService: HttpService);
    getCurrentSupportedServices(): Array<string>;
    getDiscordApplicationToken(): string;
    getSlackApplicationToken(): string;
    getDiscordClient(): Client;
    executeClientsListeners(): void;
    executeDiscordListener(): void;
    getChannelsInformation(): void;
    getChannelNameById(id: string): string;
    onEventExecute(event: EventCommand, message: Message): void;
    executeSlackListener(): void;
    generateJsonTemplates(): void;
    onSendDiscordMessageEventTrigger(message: string, type: ChannelEvent): void;
    handleBackendCron(): void;
    handleAndroidCron(): void;
    handleGeneralCron(): void;
    getChannels(): Array<ChannelModel>;
}
