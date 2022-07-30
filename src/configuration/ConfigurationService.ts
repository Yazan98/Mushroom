import { Injectable } from '@nestjs/common';
import { ConfigurationServiceImplementation } from './ConfigurationServiceImplementation';
import { Client, IntentsBitField, Message } from 'discord.js';
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
import { TextChannel } from 'discord.js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ConfigurationService
  implements ConfigurationServiceImplementation
{
  public static ANDROID_JSON_FILE = process.cwd() + '/libraries/android.json';
  public static BACKEND_JSON_FILE = process.cwd() + '/libraries/backend.json';
  public static BACKEND_CACHE_JSON_FILE =
    process.cwd() + '/libraries/backend-cache.json';
  public static GENERAL_JSON_FILE = process.cwd() + '/libraries/general.json';
  public static GENERAL_CACHE_JSON_FILE =
    process.cwd() + '/libraries/general-cache.json';
  public static CHANNELS_JSON_FILE = process.cwd() + '/libraries/channels.json';

  private eventsManager: ConfigurationEventsManager =
    new ConfigurationEventsManager(this);
  private discordClient: Client = null;
  private channels: Array<ChannelModel> = null;

  constructor(private readonly httpService: HttpService) {
    this.executeClientsListeners();
  }

  getCurrentSupportedServices(): Array<string> {
    const supportedPlatforms = process.env.SUPPORTED_SERVICES;
    if (!supportedPlatforms) {
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
    return process.env.DISCORD_BOT_TOKEN;
  }

  getSlackApplicationToken(): string {
    return process.env.SLACK_APPLICATION_TOKEN;
  }

  getDiscordClient(): Client {
    return this.discordClient;
  }

  executeClientsListeners() {
    const supportedServices = this.getCurrentSupportedServices();
    for (let i = 0; i < supportedServices.length; i++) {
      if (supportedServices[i] === 'slack') {
        this.executeSlackListener();
      } else {
        this.executeDiscordListener();
      }
    }
  }

  executeDiscordListener() {
    this.discordClient = new Client({
      intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.Guilds,
      ],
    });

    this.discordClient.on('messageCreate', (message: Message) => {
      if (message.author.bot && !message.content.includes('get libraries')) {
        console.log('Ignoring bot message!');
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

    this.discordClient
      .login(this.getDiscordApplicationToken())
      .then(() => console.log('Login Log'))
      .catch((ex) => console.error(ex));
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

    console.log('Channels : ' + this.channels);
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
      new GithubAccountRepositoriesManager(this.httpService).onImplementAction(
        event.target,
        message,
      );
    }

    if (event.type == EventCommandType.GET_ACCOUNT_INFO) {
      new GithubAccountManager(this.httpService).onImplementAction(
        event.target,
        message,
      );
    }

    if (event.type == EventCommandType.GET_REPO_INFO) {
      new GithubRepositoryManager(this.httpService).onImplementAction(
        event.target,
        message,
      );
    }

    if (event.type == EventCommandType.GET_BACKEND_LIBRARIES) {
      new GithubRepositoriesTagsManager(
        this.httpService,
        ConfigurationService.BACKEND_JSON_FILE,
        'Backend',
        ConfigurationService.BACKEND_CACHE_JSON_FILE,
      ).onImplementAction('', message);
    }

    if (event.type == EventCommandType.GET_ANDROID_LIBRARIES) {
      new AndroidRepositoryManager(this.httpService).onImplementAction(
        event.target,
        message,
      );
    }

    if (event.type == EventCommandType.GET_GITHUB_LIBRARIES) {
      new GithubRepositoriesTagsManager(
        this.httpService,
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

  onSendDiscordMessageEventTrigger(message: string) {
    if (this.discordClient != null) {
      (
        this.discordClient.channels.cache.get(
          '1001968096615071845',
        ) as TextChannel
      ).send(message);
    }
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  handleCron() {
    console.log('Every minute');
    this.onSendDiscordMessageEventTrigger('get libraries backend');
  }

  getChannels(): Array<ChannelModel> {
    return this.channels;
  }
}
