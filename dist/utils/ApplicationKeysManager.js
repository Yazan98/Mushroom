"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationKeysManager = void 0;
class ApplicationKeysManager {
    static getDiscordToken() {
        return '';
    }
    static getSupportedPlatforms() {
        return 'discord';
    }
    static getGithubUsername() {
        return 'Yazan98';
    }
    static getGithubToken() {
        return '';
    }
    static getFilePath() {
        const isLocalEnv = process.env.IS_LOCAL_DEV;
        if (!isLocalEnv) {
            return '/src/';
        }
        else {
            return '/app/src/';
        }
    }
}
exports.ApplicationKeysManager = ApplicationKeysManager;
//# sourceMappingURL=ApplicationKeysManager.js.map