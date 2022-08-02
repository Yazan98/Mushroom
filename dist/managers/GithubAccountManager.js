"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAccountManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
class GithubAccountManager extends DependencyManager_1.DependencyManager {
    constructor(httpService, configService) {
        super(configService);
        this.httpService = httpService;
    }
    onImplementAction(event, message) {
        this.httpService.axiosRef
            .get('users/' + event, this.getRequestConfig())
            .then((result) => {
            message.reply(GithubAccountManager.getMessageBody(result.data));
        })
            .catch((ex) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog('Error : ' + ex);
            message.reply('Failed to Get User Information With Id : ' + event);
        });
    }
    static getMessageBody(user) {
        let response = '';
        response +=
            'Profile Information in Github is Available : ' + user.login + ' \n';
        response += 'Profile Name : ' + user.name + ' \n';
        if (user.company) {
            response += 'Profile Company : ' + user.company + ' \n';
        }
        if (user.location) {
            response += 'Profile Location : ' + user.location + ' \n';
        }
        if (user.blog) {
            response += 'Profile Website : ' + user.blog + ' \n';
        }
        if (user.twitter_username) {
            response += 'Profile Twitter : ' + user.twitter_username + ' \n';
        }
        response += 'Profile Followers : ' + user.followers + ' \n';
        response += 'Profile Followings : ' + user.following + ' \n';
        response += 'Profile Public Gists : ' + user.public_gists + ' \n';
        response += 'Profile Public Repos : ' + user.public_repos + ' \n';
        if (user.bio) {
            response += ' \n';
            response += 'Profile Description : ' + user.bio.trim() + ' \n';
        }
        return response;
    }
}
exports.GithubAccountManager = GithubAccountManager;
//# sourceMappingURL=GithubAccountManager.js.map