"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoriesTagsManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
const CacheFileManager_1 = require("./CacheFileManager");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
class GithubRepositoriesTagsManager extends DependencyManager_1.DependencyManager {
    constructor(httpService, configService, fileName, mode, cacheFile) {
        super(configService);
        this.httpService = httpService;
        this.fileName = fileName;
        this.mode = mode;
        this.cacheFile = cacheFile;
        this.cachedLibraries = null;
        this.cacheManager = null;
        this.cacheManager = new CacheFileManager_1.CacheFileManager(cacheFile);
        this.cachedLibraries = this.cacheManager.onPrepareCacheFileLibraries();
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
                    this.onUpdateMessageSend(message, libraryName, data[0].name);
                }
            }
        })
            .catch((ex) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog(ex);
            message.reply('Something Wrong While Processing ' +
                this.mode +
                ' Libraries : ' +
                ex.message);
        });
    }
    onUpdateMessageSend(message, name, version) {
        let cachedVersion = '';
        for (let i = 0; i < this.cachedLibraries.length; i++) {
            if (this.cachedLibraries[i].name === name) {
                cachedVersion = this.cachedLibraries[i].version;
                break;
            }
        }
        if (cachedVersion !== version) {
            message.reply(this.getLibraryUpdateMessage(name, version));
            this.cacheManager.updateJsonValue(name, version);
        }
    }
    getLibraryUpdateMessage(name, version) {
        let response = '';
        response += 'Library New Version Available : ' + name + '\n';
        response += 'Library Version : ' + version + '\n';
        response += 'Github Link : ' + `https://github.com/${name}` + '\n';
        response +=
            'Github Link Releases : ' + `https://github.com/${name}/releases` + '\n';
        return response;
    }
}
exports.GithubRepositoriesTagsManager = GithubRepositoriesTagsManager;
//# sourceMappingURL=GithubRepositoriesTagsManager.js.map