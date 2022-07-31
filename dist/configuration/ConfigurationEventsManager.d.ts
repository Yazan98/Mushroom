import { ConfigurationService } from './ConfigurationService';
import { Message } from 'discord.js';
export declare class ConfigurationEventsManager {
    private readonly service;
    static GET_USER_INFO: string;
    static GET_USER_REPOSITORIES: string;
    static GET_REPO_INFO: string;
    static RUN_LIBRARIES_VERSIONS: string;
    static LOCAL_TESTING_CHANNEL: string;
    static INFO_CHANNEL: string;
    static GENERAL_CHANNEL: string;
    constructor(service: ConfigurationService);
    onEventTriggered(event: string, channelId: string, message: Message): void;
    private onInfoEvent;
    private onValidateEventInfo;
    private onRunLibrariesVersion;
}
