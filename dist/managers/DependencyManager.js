"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyManager = void 0;
const axios_1 = require("axios");
const ApplicationUtils_1 = require("../utils/ApplicationUtils");
const ApplicationKeysManager_1 = require("../utils/ApplicationKeysManager");
class DependencyManager {
    getRequestConfig() {
        return {
            baseURL: 'https://api.github.com/',
            responseType: 'json',
            timeout: 5000,
            auth: {
                username: ApplicationKeysManager_1.ApplicationKeysManager.getGithubUsername(),
                password: ApplicationKeysManager_1.ApplicationKeysManager.getGithubToken(),
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
    static getFirebaseDocumentationUrl(artifact) {
        if (artifact.includes('firestore')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/firestore';
        }
        else if (artifact.includes('crashlytics')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/crashlytics';
        }
        else if (artifact.includes('analytics')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/analytics';
        }
        else if (artifact.includes('ads')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/ads';
        }
        else if (artifact.includes('appindexing')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/appindexing';
        }
        else if (artifact.includes('auth')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/auth';
        }
        else if (artifact.includes('config')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/config';
        }
        else if (artifact.includes('database')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/database';
        }
        else if (artifact.includes('dynamic-links')) {
            return (DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/dynamic-links');
        }
        else if (artifact.includes('functions')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/functions';
        }
        else if (artifact.includes('invites')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/invites';
        }
        else if (artifact.includes('messaging')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/messaging';
        }
        else if (artifact.includes('storage')) {
            return DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION + '/storage';
        }
        else {
            return 'UnKnown';
        }
    }
}
exports.DependencyManager = DependencyManager;
DependencyManager.FIREBASE_KEY = 'firebase';
DependencyManager.FIREBASE_BASE_URL_DOCUMENTATION = 'https://firebase.google.com/docs';
DependencyManager.RELEASE_NOTES_FIREBASE = 'https://firebase.google.com/support/release-notes/android';
//# sourceMappingURL=DependencyManager.js.map