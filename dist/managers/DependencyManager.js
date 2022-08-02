"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyManager = void 0;
const axios_1 = require("axios");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
class DependencyManager {
    constructor(configService) {
        this.configService = configService;
    }
    getRequestConfig() {
        return {
            baseURL: 'https://api.github.com/',
            responseType: 'json',
            timeout: 5000,
            auth: {
                username: this.configService.get('GITHUB_CLIENT_NAME'),
                password: this.configService.get('GITHUB_SECRETE'),
            },
        };
    }
    getGoogleMavenRepositoriesInstance() {
        const instance = axios_1.default.create({
            timeout: 5000,
            baseURL: 'https://dl.google.com',
            responseType: 'text',
            headers: { Accept: 'application/xml' },
        });
        instance.interceptors.request.use((request) => {
            ApplicationUtils_1.ApplicationUtils.printAppLog('Google Starting Request : ' + request.url);
            return request;
        });
        return instance;
    }
}
exports.DependencyManager = DependencyManager;
//# sourceMappingURL=DependencyManager.js.map