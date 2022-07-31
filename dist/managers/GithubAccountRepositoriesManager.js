"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAccountRepositoriesManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
class GithubAccountRepositoriesManager extends DependencyManager_1.DependencyManager {
    constructor(httpService) {
        super();
        this.httpService = httpService;
    }
    onImplementAction(event, message) {
        this.httpService.axiosRef
            .get('users/' + event + '/repos', this.getRequestConfig())
            .then((result) => {
            const response = result.data;
            message.reply('=========== Repositories Started ===========');
            for (let i = 0; i < response.length; i++) {
                message.reply(GithubAccountRepositoriesManager.getMessageBody(response[i]));
            }
            message.reply('=========== Repositories Finished ===========');
        })
            .catch((ex) => {
            console.log('Error : ' + ex);
            message.reply('Failed to Get User Information With Id : ' + event);
        });
    }
    static getMessageBody(repository) {
        let response = '';
        if (repository.name) {
            response +=
                'Repository Information Available for : ' + repository.name + '\n';
        }
        if (repository.description) {
            response +=
                'Repository Description : ' + repository.description.trim() + '\n';
        }
        response += 'Repository Full Name : ' + repository.full_name + '\n';
        if (repository.fork) {
            response += 'Repository Forked' + '\n';
        }
        if (repository.html_url) {
            response += 'Repository Url : ' + repository.html_url + '\n';
        }
        if (repository.stargazers_count) {
            response += 'Stars : ' + repository.stargazers_count + '\n';
        }
        if (repository.watchers_count) {
            response += 'Watchers : ' + repository.watchers_count + '\n';
        }
        if (repository.language) {
            response += 'Language : ' + repository.language + '\n';
        }
        if (repository.open_issues) {
            response += 'Open Issues : ' + repository.open_issues + '\n';
        }
        if (repository.default_branch) {
            response += 'Branch : ' + repository.default_branch + '\n';
        }
        return response;
    }
}
exports.GithubAccountRepositoriesManager = GithubAccountRepositoriesManager;
//# sourceMappingURL=GithubAccountRepositoriesManager.js.map