import { Injectable } from '@nestjs/common';
import { ConfigurationServiceImplementation } from './ConfigurationServiceImplementation';
import { Client, IntentsBitField, Message, TextChannel } from 'discord.js';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ChannelModel } from '../models/ChannelModel';
import { ConfigurationEventsManager } from './ConfigurationEventsManager';
import { EventCommand, EventCommandType } from '../models/EventCommand';
import { GithubAccountRepositoriesManager } from '../managers/GithubAccountRepositoriesManager';
import { GithubAccountManager } from '../managers/GithubAccountManager';
import { GithubRepositoryManager } from '../managers/GithubRepositoryManager';
import { HttpService } from '@nestjs/axios';
import { AndroidRepositoryManager } from '../managers/AndroidRepositoryManager';
import * as fs from 'fs';
import { GithubRepositoriesTagsManager } from '../managers/GithubRepositoriesTagsManager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChannelEvent } from '../models/ChannelEvent';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService
  implements ConfigurationServiceImplementation
{
  public static ANDROID_JSON_FILE =
    process.cwd() + '/src/libraries/android.json';
  public static ANDROID_CACHE_JSON_FILE =
    process.cwd() + '/src/libraries/cache/android-cache.json';
  public static BACKEND_JSON_FILE =
    process.cwd() + '/src/libraries/backend.json';
  public static BACKEND_CACHE_JSON_FILE =
    process.cwd() + '/src/libraries/cache/backend-cache.json';
  public static GENERAL_JSON_FILE =
    process.cwd() + '/src/libraries/general.json';
  public static GENERAL_CACHE_JSON_FILE =
    process.cwd() + '/src/libraries/cache/general-cache.json';
  public static CHANNELS_JSON_FILE =
    process.cwd() + '/src/libraries/channels.json';

  private eventsManager: ConfigurationEventsManager =
    new ConfigurationEventsManager(this);
  private discordClient: Client = null;
  private channels: Array<ChannelModel> = null;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.executeClientsListeners();
  }

  getCurrentSupportedServices(): Array<string> {
    ApplicationUtils.printAppLog('Supported Platforms Started !!');
    const supportedPlatforms = this.configService.get('SUPPORTED_SERVICES');
    ApplicationUtils.printAppLog('Supported Platforms : ' + supportedPlatforms);
    if (!supportedPlatforms) {
      ApplicationUtils.printAppLog('No Supported Platforms Available !!');
      return [];
    }

    if (!supportedPlatforms.includes(',')) {
      return [supportedPlatforms];
    }

    const resultPlatforms = [];
    const platforms = supportedPlatforms.split(',');
    for (let i = 0; i < platforms.length; i++) {
      resultPlatforms.push(platforms[i]);
    }
    return resultPlatforms;
  }

  getDiscordApplicationToken(): string {
    return this.configService.get('DISCORD_BOT_TOKEN');
  }

  getSlackApplicationToken(): string {
    return this.configService.get('SLACK_APPLICATION_TOKEN');
  }

  getDiscordClient(): Client {
    return this.discordClient;
  }

  executeClientsListeners() {
    const supportedServices = this.getCurrentSupportedServices();
    ApplicationUtils.printAppLog('Clients Start ...');
    for (let i = 0; i < supportedServices.length; i++) {
      ApplicationUtils.printAppLog('Init Client : ' + supportedServices[i]);
      if (supportedServices[i] === 'slack') {
        this.executeSlackListener();
      } else {
        this.executeDiscordListener();
      }
    }
  }

  executeDiscordListener() {
    ApplicationUtils.printAppLog('Load Discord Client ...');
    this.discordClient = new Client({
      intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.Guilds,
      ],
    });

    this.discordClient.on('messageCreate', (message: Message) => {
      if (message.author.bot && !message.content.includes('get libraries')) {
        ApplicationUtils.printAppLog('Ignoring bot message!');
        return;
      }

      if (this.channels == null) {
        this.getChannelsInformation();
      }

      this.eventsManager.onEventTriggered(
        message.content,
        message.channelId,
        message,
      );
    });

    ApplicationUtils.printAppLog(
      'Discord Client : ' + this.getDiscordApplicationToken(),
    );
    this.discordClient
      .login(this.getDiscordApplicationToken())
      .then(() => {
        if (this.channels == null) {
          this.getChannelsInformation();
        }
        ApplicationUtils.printAppLog('Discord Client Connected !!');
      })
      .catch((ex) => {
        ApplicationUtils.printAppLog('Discord Client Error : ' + ex.message);
        ApplicationUtils.printAppLog(ex);
      });

    ApplicationUtils.printAppLog('Discord Client Started !!');
  }

  getChannelsInformation() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const channelsJsonFile = fs.readFileSync(
      ConfigurationService.CHANNELS_JSON_FILE,
    );

    const channelsInfo = JSON.parse(channelsJsonFile).channels;
    this.channels = [];
    for (let i = 0; i < channelsInfo.length; i++) {
      this.channels.push(
        new ChannelModel(channelsInfo[i].id, channelsInfo[i].name),
      );
    }

    ApplicationUtils.printAppLog('Channels : ' + this.channels);
  }

  getChannelNameById(id: string): string {
    if (this.channels == null) return '';
    let channelName = '';
    for (let i = 0; i < this.channels.length; i++) {
      if (id === this.channels[i].id) {
        channelName = this.channels[i].name;
      }
    }

    return channelName;
  }

  onEventExecute(event: EventCommand, message: Message) {
    if (event.type == EventCommandType.GET_REPOS) {
      new GithubAccountRepositoriesManager(
        this.httpService,
        this.configService,
      ).onImplementAction(event.target, message);
    }

    if (event.type == EventCommandType.GET_ACCOUNT_INFO) {
      new GithubAccountManager(
        this.httpService,
        this.configService,
      ).onImplementAction(event.target, message);
    }

    if (event.type == EventCommandType.GET_REPO_INFO) {
      new GithubRepositoryManager(
        this.httpService,
        this.configService,
      ).onImplementAction(event.target, message);
    }

    if (event.type == EventCommandType.GET_BACKEND_LIBRARIES) {
      new GithubRepositoriesTagsManager(
        this.httpService,
        this.configService,
        ConfigurationService.BACKEND_JSON_FILE,
        'Backend',
        ConfigurationService.BACKEND_CACHE_JSON_FILE,
      ).onImplementAction('', message);
    }

    if (event.type == EventCommandType.GET_ANDROID_LIBRARIES) {
      new AndroidRepositoryManager(
        this.httpService,
        this.configService,
      ).onImplementAction(event.target, message);

      new GithubRepositoriesTagsManager(
        this.httpService,
        this.configService,
        ConfigurationService.ANDROID_JSON_FILE,
        'Android',
        ConfigurationService.ANDROID_CACHE_JSON_FILE,
      ).onImplementAction('', message);
    }

    if (event.type == EventCommandType.GET_GITHUB_LIBRARIES) {
      new GithubRepositoriesTagsManager(
        this.httpService,
        this.configService,
        ConfigurationService.GENERAL_JSON_FILE,
        'General',
        ConfigurationService.GENERAL_CACHE_JSON_FILE,
      ).onImplementAction('', message);
    }

    if (event.type == EventCommandType.UNKNOWN_COMMAND) {
      message.reply(ApplicationUtils.getHelpCommands());
    }
  }

  executeSlackListener() {
    // Add Slack Instance Here
  }

  generateJsonTemplates() {
    if (fs.existsSync(ConfigurationService.ANDROID_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.ANDROID_JSON_FILE} Already Exists ..`,
      );
    }

    if (fs.existsSync(ConfigurationService.BACKEND_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.BACKEND_JSON_FILE} Already Exists ..`,
      );
    }

    if (fs.existsSync(ConfigurationService.GENERAL_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.GENERAL_JSON_FILE} Already Exists ..`,
      );
    }
  }

  onSendDiscordMessageEventTrigger(message: string, type: ChannelEvent) {
    let targetSenderChannel = '';
    if (this.channels != null) {
      for (let i = 0; i < this.channels.length; i++) {
        if (
          this.channels[i].name === 'Android Libraries' &&
          type == ChannelEvent.ANDROID
        ) {
          targetSenderChannel = this.channels[i].id;
        }

        if (
          this.channels[i].name === 'Backend Libraries' &&
          type == ChannelEvent.BACKEND
        ) {
          targetSenderChannel = this.channels[i].id;
        }

        if (
          this.channels[i].name === 'Github Libraries' &&
          type == ChannelEvent.GENERAL
        ) {
          targetSenderChannel = this.channels[i].id;
        }
      }
    }

    if (this.discordClient != null) {
      (
        this.discordClient.channels.cache.get(
          targetSenderChannel,
        ) as TextChannel
      ).send(message);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleBackendCron() {
    ApplicationUtils.printAppLog('Backend Cron Job Started');
    this.onSendDiscordMessageEventTrigger(
      'get libraries backend',
      ChannelEvent.BACKEND,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleAndroidCron() {
    ApplicationUtils.printAppLog('Android Cron Job Started');
    this.onSendDiscordMessageEventTrigger(
      'get libraries android',
      ChannelEvent.ANDROID,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleGeneralCron() {
    ApplicationUtils.printAppLog('General Cron Job Started');
    this.onSendDiscordMessageEventTrigger(
      'get libraries general',
      ChannelEvent.GENERAL,
    );
  }

  getChannels(): Array<ChannelModel> {
    return this.channels;
  }
}
