"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationEventsManager = void 0;
const EventCommand_1 = require("../models/EventCommand");
class ConfigurationEventsManager {
    constructor(service) {
        this.service = service;
    }
    onEventTriggered(event, channelId, message) {
        if (event.includes(ConfigurationEventsManager.GET_USER_INFO)) {
            this.onInfoEvent(event, channelId, message);
        }
        else if (event.includes(ConfigurationEventsManager.GET_USER_REPOSITORIES)) {
            this.onInfoEvent(event, channelId, message);
        }
        else if (event.includes(ConfigurationEventsManager.GET_REPO_INFO)) {
            this.onInfoEvent(event, channelId, message);
        }
        else if (event.includes(ConfigurationEventsManager.RUN_LIBRARIES_VERSIONS)) {
            this.onRunLibrariesVersion(event, channelId, message);
        }
        else {
            this.service.onEventExecute({
                type: EventCommand_1.EventCommandType.UNKNOWN_COMMAND,
                target: '',
            }, message);
        }
    }
    onInfoEvent(event, channelId, message) {
        const channels = this.service.getChannels();
        let targetChannel = '';
        for (let i = 0; i < channels.length; i++) {
            if (channels[i].id === channelId) {
                targetChannel = channels[i].name;
            }
        }
        if (targetChannel === ConfigurationEventsManager.LOCAL_TESTING_CHANNEL) {
            this.onValidateEventInfo(event, message);
        }
        else if (targetChannel === ConfigurationEventsManager.GENERAL_CHANNEL) {
            this.onValidateEventInfo(event, message);
        }
        else if (targetChannel === ConfigurationEventsManager.INFO_CHANNEL) {
            this.onValidateEventInfo(event, message);
        }
        else {
            message.reply('Wrong Channel, This Command is Not Allowed in this Channel !!');
        }
    }
    onValidateEventInfo(event, message) {
        if (event.includes(ConfigurationEventsManager.GET_USER_INFO)) {
            const command = event.split(ConfigurationEventsManager.GET_USER_INFO)[1];
            this.service.onEventExecute({
                type: EventCommand_1.EventCommandType.GET_ACCOUNT_INFO,
                target: command.trim(),
            }, message);
        }
        else if (event.includes(ConfigurationEventsManager.GET_REPO_INFO)) {
            const command = event.split(ConfigurationEventsManager.GET_REPO_INFO)[1];
            this.service.onEventExecute({
                type: EventCommand_1.EventCommandType.GET_REPO_INFO,
                target: command.trim(),
            }, message);
        }
        else if (event.includes(ConfigurationEventsManager.GET_USER_REPOSITORIES)) {
            const command = event.split(ConfigurationEventsManager.GET_USER_REPOSITORIES)[1];
            this.service.onEventExecute({
                type: EventCommand_1.EventCommandType.GET_REPOS,
                target: command.trim(),
            }, message);
        }
        else {
            this.service.onEventExecute({
                type: EventCommand_1.EventCommandType.UNKNOWN_COMMAND,
                target: '',
            }, message);
        }
    }
    onRunLibrariesVersion(event, channelId, message) {
        const channels = this.service.getChannels();
        let targetChannel = '';
        for (let i = 0; i < channels.length; i++) {
            if (channels[i].id === channelId) {
                targetChannel = channels[i].name;
            }
        }
        if (targetChannel === ConfigurationEventsManager.LOCAL_TESTING_CHANNEL) {
            message.reply('Wrong Channel, This Command is Not Allowed in this Channel !!');
        }
        else if (targetChannel === ConfigurationEventsManager.GENERAL_CHANNEL) {
            message.reply('Wrong Channel, This Command is Not Allowed in this Channel !!');
        }
        else if (targetChannel === ConfigurationEventsManager.INFO_CHANNEL) {
            message.reply('Wrong Channel, This Command is Not Allowed in this Channel !!');
        }
        else {
            const command = event
                .split(ConfigurationEventsManager.RUN_LIBRARIES_VERSIONS)[1]
                .trim();
            if (command === 'android') {
                this.service.onEventExecute({
                    type: EventCommand_1.EventCommandType.GET_ANDROID_LIBRARIES,
                    target: command.trim(),
                }, message);
            }
            else if (command === 'backend') {
                this.service.onEventExecute({
                    type: EventCommand_1.EventCommandType.GET_BACKEND_LIBRARIES,
                    target: command.trim(),
                }, message);
            }
            else if (command === 'github') {
                this.service.onEventExecute({
                    type: EventCommand_1.EventCommandType.GET_GITHUB_LIBRARIES,
                    target: command.trim(),
                }, message);
            }
            else {
                this.service.onEventExecute({
                    type: EventCommand_1.EventCommandType.UNKNOWN_COMMAND,
                    target: '',
                }, message);
            }
        }
    }
}
exports.ConfigurationEventsManager = ConfigurationEventsManager;
ConfigurationEventsManager.GET_USER_INFO = 'get account info';
ConfigurationEventsManager.GET_USER_REPOSITORIES = 'get account repos';
ConfigurationEventsManager.GET_REPO_INFO = 'get repo info';
ConfigurationEventsManager.RUN_LIBRARIES_VERSIONS = 'get libraries';
ConfigurationEventsManager.LOCAL_TESTING_CHANNEL = 'Local Testing';
ConfigurationEventsManager.INFO_CHANNEL = 'Info';
ConfigurationEventsManager.GENERAL_CHANNEL = 'General';
//# sourceMappingURL=ConfigurationEventsManager.js.map