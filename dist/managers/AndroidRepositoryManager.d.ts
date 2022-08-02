import { HttpService } from '@nestjs/axios';
import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { ConfigService } from '@nestjs/config';
export declare class AndroidRepositoryManager extends DependencyManager {
    private readonly httpService;
    static ANDROID_MAVEN_PATH: string;
    static ANDROID_ALL_LIBRARIES: string;
    private static CONSOLE_LOGGING_KEY;
    static GROUP_ARTIFACTS: string;
    private static GOOGLE_LIBRARIES_FILE;
    private static GOOGLE_LIBRARIES_CACHE_FILE;
    private cachedLibraries;
    private cacheManager;
    constructor(httpService: HttpService, configService: ConfigService);
    onImplementAction(event: string, message: Message): void;
    private validatePackagesResponse;
    private onValidateJsonContentVersions;
    private getLibraryInformation;
    private validateLibraryVersionArtifacts;
    private onValidateLibraryVersion;
    private getMessage;
}
