"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidRepositoryManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
const fs = require("fs");
const xml2js = require("xml2js");
const CacheFileManager_1 = require("./CacheFileManager");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
class AndroidRepositoryManager extends DependencyManager_1.DependencyManager {
    constructor(httpService, configService) {
        super(configService);
        this.httpService = httpService;
        this.cachedLibraries = null;
        this.cacheManager = null;
        this.cacheManager = new CacheFileManager_1.CacheFileManager(AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE);
        this.cachedLibraries = this.cacheManager.onPrepareCacheFileLibraries();
    }
    onImplementAction(event, message) {
        this.getGoogleMavenRepositoriesInstance()
            .get(AndroidRepositoryManager.ANDROID_MAVEN_PATH +
            AndroidRepositoryManager.ANDROID_ALL_LIBRARIES)
            .then((response) => {
            this.validatePackagesResponse(response.data.toString(), message).catch((exception) => {
                ApplicationUtils_1.ApplicationUtils.printAppLog('Error Triggered : ' + ' Exception : ' + exception);
            });
        })
            .catch((ex) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog(ex);
            message.reply('Something Wrong With Google Maven Repository');
        });
    }
    async validatePackagesResponse(response, message) {
        xml2js.parseString(response, (err, result) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify(result, null, 4);
            fs.writeFileSync(AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE, json);
            this.onValidateJsonContentVersions(result, message);
        });
    }
    async onValidateJsonContentVersions(result, message) {
        const librariesMap = new Map(Object.entries(result.metadata));
        for (const key of librariesMap.keys()) {
            await this.getLibraryInformation(key, message);
        }
    }
    async getLibraryInformation(name, message) {
        await this.getGoogleMavenRepositoriesInstance()
            .get(AndroidRepositoryManager.ANDROID_MAVEN_PATH +
            name.split('.').join('/').trim() +
            AndroidRepositoryManager.GROUP_ARTIFACTS, {
            method: 'get',
        })
            .then((response) => {
            this.validateLibraryVersionArtifacts(response.data.toString(), name, message);
        })
            .catch((exception) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
                ' Exception : ' +
                exception);
        });
    }
    async validateLibraryVersionArtifacts(content, library, message) {
        xml2js.parseString(content, (err, result) => {
            if (err) {
                throw err;
            }
            const librariesMap = new Map(Object.entries(result));
            for (const key of librariesMap.keys()) {
                if (librariesMap.has(key)) {
                    const artifacts = new Map(Object.entries(librariesMap.get(key)));
                    for (const key of artifacts.keys()) {
                        const artifact = artifacts.get(key);
                        const artifactVersionsContainer = new Map(Object.entries(artifact));
                        const versions = new Map(Object.entries(artifactVersionsContainer.get('0'))).get('$');
                        const version = new Map(Object.entries(versions))
                            .get('versions')
                            .toString();
                        if (version.includes(',')) {
                            this.onValidateLibraryVersion(library, key, version.split(',')[0], message);
                        }
                        else {
                            this.onValidateLibraryVersion(library, key, version, message);
                        }
                    }
                }
            }
        });
    }
    async onValidateLibraryVersion(library, artifact, version, message) {
        let cachedVersion = '';
        for (let i = 0; i < this.cachedLibraries.length; i++) {
            if (this.cachedLibraries[i].name === library + ':' + artifact) {
                cachedVersion = this.cachedLibraries[i].version;
                break;
            }
        }
        if (cachedVersion !== version) {
            message.reply(this.getMessage(library, artifact, version));
            this.cacheManager.updateJsonValue(`${library}:${artifact}`, version);
        }
    }
    getMessage(name, artifact, version) {
        let response = '';
        response += 'Official Google Library Update : ' + name + '\n';
        response += 'Library has New Version : ' + name + '\n';
        response += 'Artifact : ' + artifact + '\n';
        response += 'Version : ' + version + '\n';
        response +=
            'Library Link : ' +
                `https://maven.google.com/web/index.html#${name}:${artifact}:${version}` +
                '\n';
        return response;
    }
}
exports.AndroidRepositoryManager = AndroidRepositoryManager;
AndroidRepositoryManager.ANDROID_MAVEN_PATH = '/android/maven2/';
AndroidRepositoryManager.ANDROID_ALL_LIBRARIES = 'master-index.xml';
AndroidRepositoryManager.CONSOLE_LOGGING_KEY = '[Google Dependencies]';
AndroidRepositoryManager.GROUP_ARTIFACTS = '/group-index.xml';
AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE = process.cwd() + '/src/libraries/google-libraries.json';
AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE = process.cwd() + '/src/libraries/cache/google-cache.json';
//# sourceMappingURL=AndroidRepositoryManager.js.map