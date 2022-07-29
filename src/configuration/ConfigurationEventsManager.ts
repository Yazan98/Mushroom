import { ConfigurationService } from './ConfigurationService';
import { Message } from 'discord.js';
import { EventCommandType } from '../messages/EventCommand';

export class ConfigurationEventsManager {
  public static GET_USER_INFO = 'get account info';
  public static GET_USER_REPOSITORIES = 'get account repos';
  public static GET_REPO_INFO = 'get repo info';
  public static RUN_LIBRARIES_VERSIONS = 'get libraries';

  public static LOCAL_TESTING_CHANNEL = 'Local Testing';
  public static GITHUB_LIBRARIES_CHANNEL = 'Github Libraries';
  public static ANDROID_LIBRARIES_CHANNEL = 'Android Libraries';
  public static BACKEND_LIBRARIES_CHANNEL = 'Backend Libraries';
  public static INFO_CHANNEL = 'Info';
  public static GITHUB_CHANNEL = 'Github';
  public static GENERAL_CHANNEL = 'General';

  constructor(private readonly service: ConfigurationService) {}

  onEventTriggered(event: string, channelId: string, message: Message) {
    if (event.includes(ConfigurationEventsManager.GET_USER_INFO)) {
      this.onInfoEvent(event, channelId, message);
    }

    if (event.includes(ConfigurationEventsManager.GET_USER_REPOSITORIES)) {
      this.onInfoEvent(event, channelId, message);
    }

    if (event.includes(ConfigurationEventsManager.GET_REPO_INFO)) {
      this.onInfoEvent(event, channelId, message);
    }

    if (event.includes(ConfigurationEventsManager.RUN_LIBRARIES_VERSIONS)) {
      this.onRunLibrariesVersion(event, channelId, message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private onInfoEvent(event: string, channelId: string, message: Message) {
    const channels = this.service.getChannels();
    let targetChannel = '';
    for (let i = 0; i < channels.length; i++) {
      if (channels[i].id === channelId) {
        targetChannel = channels[i].name;
      }
    }

    if (targetChannel === ConfigurationEventsManager.LOCAL_TESTING_CHANNEL) {
      this.onValidateEventInfo(event, message);
    } else if (targetChannel === ConfigurationEventsManager.GENERAL_CHANNEL) {
      this.onValidateEventInfo(event, message);
    } else if (targetChannel === ConfigurationEventsManager.INFO_CHANNEL) {
      this.onValidateEventInfo(event, message);
    } else {
      message.reply(
        'Wrong Channel, This Command is Not Allowed in this Channel !!',
      );
    }
  }

  private onValidateEventInfo(event: string, message: Message) {
    if (event.includes(ConfigurationEventsManager.GET_USER_INFO)) {
      const command = event.split(ConfigurationEventsManager.GET_USER_INFO)[1];
      this.service.onEventExecute(
        {
          type: EventCommandType.GET_ACCOUNT_INFO,
          target: command.trim(),
        },
        message,
      );
    }

    if (event.includes(ConfigurationEventsManager.GET_REPO_INFO)) {
      const command = event.split(ConfigurationEventsManager.GET_REPO_INFO)[1];
      this.service.onEventExecute(
        {
          type: EventCommandType.GET_REPO_INFO,
          target: command.trim(),
        },
        message,
      );
    }

    if (event.includes(ConfigurationEventsManager.GET_USER_REPOSITORIES)) {
      const command = event.split(
        ConfigurationEventsManager.GET_USER_REPOSITORIES,
      )[1];
      this.service.onEventExecute(
        {
          type: EventCommandType.GET_REPOS,
          target: command.trim(),
        },
        message,
      );
    }
  }

  private onRunLibrariesVersion(
    event: string,
    channelId: string,
    message: Message,
  ) {
    message.reply('onRunLibrariesVersion');
  }
}
