"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidRepositoryManager = void 0;
const DependencyManager_1 = require("./DependencyManager");
const fs = require("fs");
const rxjs_1 = require("rxjs");
class AndroidRepositoryManager extends DependencyManager_1.DependencyManager {
    constructor(httpService) {
        super();
        this.httpService = httpService;
    }
    onImplementAction(event, message) {
        this.getGoogleMavenRepositoriesInstance()
            .get(AndroidRepositoryManager.ANDROID_MAVEN_PATH +
            AndroidRepositoryManager.ANDROID_ALL_LIBRARIES)
            .then((response) => {
            this.validatePackagesResponse(response.data.toString(), message).catch((exception) => {
                console.error('Error Triggered : ' + ' Exception : ' + exception);
            });
        })
            .catch((ex) => {
            console.error(ex);
            message.reply('Something Wrong With Google Maven Repository');
        });
    }
    async validatePackagesResponse(response, message) {
        console.log(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' Start Validating Response ===================================');
        const librariesArray = new Array();
        const responseValue = response.split('\n');
        for (let i = 0; i < responseValue.length; i++) {
            if (!responseValue[i].includes(AndroidRepositoryManager.SKIP_XML_HEADER_TAG) &&
                !responseValue[i].includes(AndroidRepositoryManager.SKIP_META_DATA_TAG)) {
                const targetValue = responseValue[i].replace('<', '').replace('/>', '');
                console.log(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
                    ' Library : ' +
                    targetValue);
                librariesArray.push(targetValue);
            }
        }
        await this.getLibrariesVersions(librariesArray, message);
        console.log(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' End Validating Response ===================================');
    }
    async getLibrariesVersions(libraries, message) {
        if (libraries == null) {
            return;
        }
        const librariesArray = new Array();
        console.log(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' Start Getting Libraries Versions ===================================');
        for (let i = 0; i < libraries.length; i++) {
            if (libraries[i] === '') {
                continue;
            }
            await (0, rxjs_1.timer)(1000);
            console.log('Start Validating Group Index For Path : ' + libraries[i]);
            await this.getGoogleMavenRepositoriesInstance()
                .get(AndroidRepositoryManager.ANDROID_MAVEN_PATH +
                libraries[i].split('.').join('/').trim() +
                AndroidRepositoryManager.GROUP_ARTIFACTS, {
                method: 'get',
            })
                .then((response) => {
                const artifacts = this.getArtifactsByGroupRequest(response.data.toString().split('\n'));
                librariesArray.push({
                    groupId: libraries[i],
                    artifacts: artifacts,
                });
            })
                .catch((exception) => {
                console.error(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
                    ' Exception : ' +
                    exception);
            });
        }
        this.validateLibrariesUpdatedVersions(librariesArray, message);
        console.log(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' End Getting Libraries Versions ===================================');
    }
    getArtifactsByGroupRequest(response) {
        const artifacts = Array();
        for (let i = 0; i < response.length; i++) {
            if (i == 0 || i == 1 || i == response.length - 2 || response[i] === '') {
                continue;
            }
            const libraryInfo = response[i].trim();
            const artifactName = libraryInfo.split(' ')[0].replace('<', '');
            const versions = libraryInfo.split('="')[1];
            artifacts.push({
                name: artifactName,
                versions: versions.replace('"/>', '').split(','),
            });
        }
        return artifacts;
    }
    validateLibrariesUpdatedVersions(librariesArray, message) {
        this.createGoogleLibrariesFile(librariesArray);
        if (!fs.existsSync(AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE)) {
            AndroidRepositoryManager.createGoogleCacheFile(librariesArray);
        }
        else {
            this.validateUpdatedLibraries(librariesArray, message);
        }
    }
    validateUpdatedLibraries(librariesArray, message) {
        fs.readFile(AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                AndroidRepositoryManager.validateUpdatedDependencies(data, librariesArray, message);
                AndroidRepositoryManager.createGoogleCacheFile(librariesArray);
            }
        });
    }
    createGoogleLibrariesFile(librariesArray) {
        const googleLibrariesObject = {
            libraries: [],
        };
        for (let i = 0; i < librariesArray.length; i++) {
            const library = librariesArray[i];
            googleLibrariesObject.libraries.push({
                groupId: library.groupId.trim(),
                artifacts: library.artifacts,
            });
        }
        const json = JSON.stringify(googleLibrariesObject, null, '\t');
        fs.writeFile(AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE, json, 'utf8', (exception) => {
            if (exception != null) {
                console.error(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
                    ' Exception : ' +
                    exception);
            }
        });
    }
    static createGoogleCacheFile(librariesArray) {
        const googleCacheObject = {
            libraries: [],
        };
        for (let i = 0; i < librariesArray.length; i++) {
            const library = librariesArray[i];
            const artifacts = Array();
            for (let j = 0; j < library.artifacts.length; j++) {
                const currentArtifact = library.artifacts[j];
                artifacts.push({
                    artifact: currentArtifact.name,
                    version: currentArtifact.versions[0],
                });
            }
            googleCacheObject.libraries.push({
                groupId: library.groupId.trim(),
                artifacts: artifacts,
            });
        }
        const json = JSON.stringify(googleCacheObject, null, '\t');
        fs.writeFile(AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE, json, 'utf8', (exception) => {
            if (exception != null) {
                console.error(AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
                    ' Exception : ' +
                    exception);
            }
        });
    }
    static validateUpdatedDependencies(data, librariesArray, message) {
        let googleCacheObject = {
            libraries: [],
        };
        const librariesToUpdate = new Array();
        googleCacheObject = JSON.parse(data);
        for (let i = 0; i < googleCacheObject.libraries.length; i++) {
            const library = googleCacheObject.libraries[i];
            for (let j = 0; j < librariesArray.length; j++) {
                const newLibrary = librariesArray[i];
                if (newLibrary.groupId.includes(library.groupId)) {
                    if (newLibrary.artifacts[0].versions[0] !== library.artifacts[0].version) {
                        librariesToUpdate.push({
                            groupId: newLibrary.groupId,
                            version: newLibrary.artifacts[0].versions[0],
                            artifact: newLibrary.artifacts[0].name,
                            url: '',
                            isGithubSource: false,
                            releaseUrl: '',
                            name: '',
                        });
                    }
                }
            }
        }
        this.onSendMessagesGoogleMavenUpdate(librariesToUpdate, message);
    }
    static onSendMessagesGoogleMavenUpdate(librariesToUpdate, message) {
        if (librariesToUpdate.length == 0) {
            message.reply('Google Maven Central No Artifact Updated !!');
            return;
        }
        for (let i = 0; i < librariesToUpdate.length; i++) {
            this.onSendMessage(message, librariesToUpdate[i]);
        }
    }
    static onSendMessage(message, model) {
        let response = '';
        response += '============= Library Update Start =============' + ' \n';
        response += 'Library Update : ' + model.artifact + ' \n';
        response += 'Library Group Id : ' + model.groupId + ' \n';
        response += 'Library Version : ' + model.version + ' \n';
        response += '============= Library Update End =============' + ' \n';
        message.reply(response);
    }
}
exports.AndroidRepositoryManager = AndroidRepositoryManager;
AndroidRepositoryManager.ANDROID_MAVEN_PATH = '/android/maven2/';
AndroidRepositoryManager.ANDROID_ALL_LIBRARIES = 'master-index.xml';
AndroidRepositoryManager.GROUP_ARTIFACTS = '/group-index.xml';
AndroidRepositoryManager.CONSOLE_LOGGING_KEY = '[Google Dependencies]';
AndroidRepositoryManager.SKIP_META_DATA_TAG = 'metadata';
AndroidRepositoryManager.SKIP_XML_HEADER_TAG = "xml version='1.0'";
AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE = process.cwd() + '/libraries/google-libraries.json';
AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE = process.cwd() + '/libraries/google-cache.json';
//# sourceMappingURL=AndroidRepositoryManager.js.map