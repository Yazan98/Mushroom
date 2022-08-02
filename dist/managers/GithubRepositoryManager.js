"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoryManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
const GithubAccountRepositoriesManager_1 = require("./GithubAccountRepositoriesManager");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
class GithubRepositoryManager extends DependencyManager_1.DependencyManager {
    constructor(httpService, configService) {
        super(configService);
        this.httpService = httpService;
    }
    onImplementAction(event, message) {
        this.httpService.axiosRef
            .get('repos/' + event, this.getRequestConfig())
            .then((result) => {
            message.reply(GithubAccountRepositoriesManager_1.GithubAccountRepositoriesManager.getMessageBody(result.data));
        })
            .catch((ex) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog('Error : ' + ex);
            message.reply('Failed to Get User Information With Id : ' + event);
        });
    }
}
exports.GithubRepositoryManager = GithubRepositoryManager;
//# sourceMappingURL=GithubRepositoryManager.js.map