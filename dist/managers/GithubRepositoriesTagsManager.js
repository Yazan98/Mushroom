"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoriesTagsManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
class GithubRepositoriesTagsManager extends DependencyManager_1.DependencyManager {
    constructor(httpService, fileName, mode, cacheFile) {
        super();
        this.httpService = httpService;
        this.fileName = fileName;
        this.mode = mode;
        this.cacheFile = cacheFile;
    }
    onImplementAction(event, message) {
        const fs = require('fs');
        const targetFile = fs.readFileSync(this.fileName);
        const libraries = JSON.parse(targetFile).libraries;
        for (let i = 0; i < libraries.length; i++) {
            this.onRepositoryRequest(message, libraries[i].name, libraries[i].version);
        }
    }
    onRepositoryRequest(message, libraryName, version) {
        this.httpService.axiosRef
            .get('repos/' + libraryName + '/tags', this.getRequestConfig())
            .then((result) => {
            const data = result.data;
            if (data == null || data.length == 0) {
                message.reply('Library ' +
                    libraryName +
                    ' Does not Contain Any Available Tags !!');
            }
            else {
                if (data[0].name !== version) {
                    this.onUpdateMessageSend(message, libraryName, data[0].name, data[0].commit.url, data[0].zipball_url);
                }
            }
        })
            .catch((ex) => {
            console.error(ex);
            message.reply('Something Wrong While Processing ' +
                this.mode +
                ' Libraries : ' +
                ex.message);
        });
    }
    onUpdateMessageSend(message, name, version, commit, link) {
        let response = '';
        response += 'Library New Version Available : ' + name + '\n';
        response += 'Library Version : ' + version + '\n';
        response += 'Library Commit : ' + commit + '\n';
        response += 'Library Link : ' + link + '\n';
        message.reply(response);
    }
}
exports.GithubRepositoriesTagsManager = GithubRepositoriesTagsManager;
//# sourceMappingURL=GithubRepositoriesTagsManager.js.map