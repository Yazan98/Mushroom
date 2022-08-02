"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConfigurationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const discord_js_1 = require("discord.js");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
const ChannelModel_1 = require("../models/ChannelModel");
const ConfigurationEventsManager_1 = require("./ConfigurationEventsManager");
const EventCommand_1 = require("../models/EventCommand");
const GithubAccountRepositoriesManager_1 = require("../managers/GithubAccountRepositoriesManager");
const GithubAccountManager_1 = require("../managers/GithubAccountManager");
const GithubRepositoryManager_1 = require("../managers/GithubRepositoryManager");
const axios_1 = require("@nestjs/axios");
const AndroidRepositoryManager_1 = require("../managers/AndroidRepositoryManager");
const fs = require("fs");
const GithubRepositoriesTagsManager_1 = require("../managers/GithubRepositoriesTagsManager");
const schedule_1 = require("@nestjs/schedule");
const ChannelEvent_1 = require("../models/ChannelEvent");
let ConfigurationService = ConfigurationService_1 = class ConfigurationService {
    constructor(httpService) {
        this.httpService = httpService;
        this.eventsManager = new ConfigurationEventsManager_1.ConfigurationEventsManager(this);
        this.discordClient = null;
        this.channels = null;
        this.executeClientsListeners();
    }
    getCurrentSupportedServices() {
        ApplicationUtils_1.ApplicationUtils.printAppLog('Supported Platforms Started !!');
        const supportedPlatforms = process.env.SUPPORTED_SERVICES;
        if (!supportedPlatforms) {
            ApplicationUtils_1.ApplicationUtils.printAppLog('No Supported Platforms Available !!');
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
    getDiscordApplicationToken() {
        return process.env.DISCORD_BOT_TOKEN;
    }
    getSlackApplicationToken() {
        return process.env.SLACK_APPLICATION_TOKEN;
    }
    getDiscordClient() {
        return this.discordClient;
    }
    executeClientsListeners() {
        const supportedServices = this.getCurrentSupportedServices();
        for (let i = 0; i < supportedServices.length; i++) {
            if (supportedServices[i] === 'slack') {
                this.executeSlackListener();
            }
            else {
                this.executeDiscordListener();
            }
        }
    }
    executeDiscordListener() {
        this.discordClient = new discord_js_1.Client({
            intents: [
                discord_js_1.IntentsBitField.Flags.GuildMessages,
                discord_js_1.IntentsBitField.Flags.MessageContent,
                discord_js_1.IntentsBitField.Flags.Guilds,
            ],
        });
        this.discordClient.on('messageCreate', (message) => {
            if (message.author.bot && !message.content.includes('get libraries')) {
                console.log('Ignoring bot message!');
                return;
            }
            if (this.channels == null) {
                this.getChannelsInformation();
            }
            this.eventsManager.onEventTriggered(message.content, message.channelId, message);
        });
        this.discordClient
            .login(this.getDiscordApplicationToken())
            .then(() => {
            if (this.channels == null) {
                this.getChannelsInformation();
            }
            console.log('Discord Client Connected !!');
        })
            .catch((ex) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog('Discord Client Error : ' + ex.message);
            console.error(ex);
        });
        ApplicationUtils_1.ApplicationUtils.printAppLog('Discord Client Started !!');
    }
    getChannelsInformation() {
        const fs = require('fs');
        const channelsJsonFile = fs.readFileSync(ConfigurationService_1.CHANNELS_JSON_FILE);
        const channelsInfo = JSON.parse(channelsJsonFile).channels;
        this.channels = [];
        for (let i = 0; i < channelsInfo.length; i++) {
            this.channels.push(new ChannelModel_1.ChannelModel(channelsInfo[i].id, channelsInfo[i].name));
        }
        console.log('Channels : ' + this.channels);
    }
    getChannelNameById(id) {
        if (this.channels == null)
            return '';
        let channelName = '';
        for (let i = 0; i < this.channels.length; i++) {
            if (id === this.channels[i].id) {
                channelName = this.channels[i].name;
            }
        }
        return channelName;
    }
    onEventExecute(event, message) {
        if (event.type == EventCommand_1.EventCommandType.GET_REPOS) {
            new GithubAccountRepositoriesManager_1.GithubAccountRepositoriesManager(this.httpService).onImplementAction(event.target, message);
        }
        if (event.type == EventCommand_1.EventCommandType.GET_ACCOUNT_INFO) {
            new GithubAccountManager_1.GithubAccountManager(this.httpService).onImplementAction(event.target, message);
        }
        if (event.type == EventCommand_1.EventCommandType.GET_REPO_INFO) {
            new GithubRepositoryManager_1.GithubRepositoryManager(this.httpService).onImplementAction(event.target, message);
        }
        if (event.type == EventCommand_1.EventCommandType.GET_BACKEND_LIBRARIES) {
            new GithubRepositoriesTagsManager_1.GithubRepositoriesTagsManager(this.httpService, ConfigurationService_1.BACKEND_JSON_FILE, 'Backend', ConfigurationService_1.BACKEND_CACHE_JSON_FILE).onImplementAction('', message);
        }
        if (event.type == EventCommand_1.EventCommandType.GET_ANDROID_LIBRARIES) {
            new AndroidRepositoryManager_1.AndroidRepositoryManager(this.httpService).onImplementAction(event.target, message);
            new GithubRepositoriesTagsManager_1.GithubRepositoriesTagsManager(this.httpService, ConfigurationService_1.ANDROID_JSON_FILE, 'Android', ConfigurationService_1.ANDROID_CACHE_JSON_FILE).onImplementAction('', message);
        }
        if (event.type == EventCommand_1.EventCommandType.GET_GITHUB_LIBRARIES) {
            new GithubRepositoriesTagsManager_1.GithubRepositoriesTagsManager(this.httpService, ConfigurationService_1.GENERAL_JSON_FILE, 'General', ConfigurationService_1.GENERAL_CACHE_JSON_FILE).onImplementAction('', message);
        }
        if (event.type == EventCommand_1.EventCommandType.UNKNOWN_COMMAND) {
            message.reply(ApplicationUtils_1.ApplicationUtils.getHelpCommands());
        }
    }
    executeSlackListener() {
    }
    generateJsonTemplates() {
        if (fs.existsSync(ConfigurationService_1.ANDROID_JSON_FILE)) {
            ApplicationUtils_1.ApplicationUtils.printAppLog(`${ConfigurationService_1.ANDROID_JSON_FILE} Already Exists ..`);
        }
        if (fs.existsSync(ConfigurationService_1.BACKEND_JSON_FILE)) {
            ApplicationUtils_1.ApplicationUtils.printAppLog(`${ConfigurationService_1.BACKEND_JSON_FILE} Already Exists ..`);
        }
        if (fs.existsSync(ConfigurationService_1.GENERAL_JSON_FILE)) {
            ApplicationUtils_1.ApplicationUtils.printAppLog(`${ConfigurationService_1.GENERAL_JSON_FILE} Already Exists ..`);
        }
    }
    onSendDiscordMessageEventTrigger(message, type) {
        let targetSenderChannel = '';
        if (this.channels != null) {
            for (let i = 0; i < this.channels.length; i++) {
                if (this.channels[i].name === 'Android Libraries' &&
                    type == ChannelEvent_1.ChannelEvent.ANDROID) {
                    targetSenderChannel = this.channels[i].id;
                }
                if (this.channels[i].name === 'Backend Libraries' &&
                    type == ChannelEvent_1.ChannelEvent.BACKEND) {
                    targetSenderChannel = this.channels[i].id;
                }
                if (this.channels[i].name === 'Github Libraries' &&
                    type == ChannelEvent_1.ChannelEvent.GENERAL) {
                    targetSenderChannel = this.channels[i].id;
                }
            }
        }
        if (this.discordClient != null) {
            this.discordClient.channels.cache.get(targetSenderChannel).send(message);
        }
    }
    handleBackendCron() {
        ApplicationUtils_1.ApplicationUtils.printAppLog('Backend Cron Job Started');
        this.onSendDiscordMessageEventTrigger('get libraries backend', ChannelEvent_1.ChannelEvent.BACKEND);
    }
    handleAndroidCron() {
        ApplicationUtils_1.ApplicationUtils.printAppLog('Android Cron Job Started');
        this.onSendDiscordMessageEventTrigger('get libraries android', ChannelEvent_1.ChannelEvent.ANDROID);
    }
    handleGeneralCron() {
        ApplicationUtils_1.ApplicationUtils.printAppLog('General Cron Job Started');
        this.onSendDiscordMessageEventTrigger('get libraries general', ChannelEvent_1.ChannelEvent.GENERAL);
    }
    getChannels() {
        return this.channels;
    }
};
ConfigurationService.ANDROID_JSON_FILE = process.cwd() + '/src/libraries/android.json';
ConfigurationService.ANDROID_CACHE_JSON_FILE = process.cwd() + '/src/libraries/cache/android-cache.json';
ConfigurationService.BACKEND_JSON_FILE = process.cwd() + '/src/libraries/backend.json';
ConfigurationService.BACKEND_CACHE_JSON_FILE = process.cwd() + '/src/libraries/cache/backend-cache.json';
ConfigurationService.GENERAL_JSON_FILE = process.cwd() + '/src/libraries/general.json';
ConfigurationService.GENERAL_CACHE_JSON_FILE = process.cwd() + '/src/libraries/cache/general-cache.json';
ConfigurationService.CHANNELS_JSON_FILE = process.cwd() + '/src/libraries/channels.json';
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationService.prototype, "handleBackendCron", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationService.prototype, "handleAndroidCron", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationService.prototype, "handleGeneralCron", null);
ConfigurationService = ConfigurationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ConfigurationService);
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=ConfigurationService.js.map