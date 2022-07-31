import { HttpService } from '@nestjs/axios';
import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { GoogleMavenLibrary } from '../models/GoogleMavenLibrary';
export declare class AndroidRepositoryManager extends DependencyManager {
    private readonly httpService;
    static ANDROID_MAVEN_PATH: string;
    static ANDROID_ALL_LIBRARIES: string;
    static GROUP_ARTIFACTS: string;
    private static CONSOLE_LOGGING_KEY;
    private static SKIP_META_DATA_TAG;
    private static SKIP_XML_HEADER_TAG;
    private static GOOGLE_LIBRARIES_FILE;
    private static GOOGLE_LIBRARIES_CACHE_FILE;
    constructor(httpService: HttpService);
    onImplementAction(event: string, message: Message): void;
    private validatePackagesResponse;
    private getLibrariesVersions;
    private getArtifactsByGroupRequest;
    private validateLibrariesUpdatedVersions;
    private validateUpdatedLibraries;
    private createGoogleLibrariesFile;
    static createGoogleCacheFile(librariesArray: Array<GoogleMavenLibrary>): void;
    static validateUpdatedDependencies(data: string, librariesArray: Array<GoogleMavenLibrary>, message: Message): void;
    private static onSendMessagesGoogleMavenUpdate;
    private static onSendMessage;
}
