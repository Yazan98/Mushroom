import { HttpService } from '@nestjs/axios';
import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { LibraryVersionCache } from '../models/LibraryVersionCache';
import { CacheFileManager } from './CacheFileManager';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ConfigService } from '@nestjs/config';

export class AndroidRepositoryManager extends DependencyManager {
  public static ANDROID_MAVEN_PATH = '/android/maven2/';
  public static ANDROID_ALL_LIBRARIES = 'master-index.xml';
  private static CONSOLE_LOGGING_KEY = '[Google Dependencies]';
  public static GROUP_ARTIFACTS = '/group-index.xml';
  private static GOOGLE_LIBRARIES_FILE =
    process.cwd() + '/app/src/libraries/google-libraries.json';
  private static GOOGLE_LIBRARIES_CACHE_FILE =
    process.cwd() + '/app/src/libraries/cache/google-cache.json';
  private cachedLibraries: Array<LibraryVersionCache> = null;
  private cacheManager: CacheFileManager = null;

  constructor(private readonly httpService: HttpService) {
    super();
    this.cacheManager = new CacheFileManager(
      AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE,
    );
    this.cachedLibraries = this.cacheManager.onPrepareCacheFileLibraries();
  }

  onImplementAction(event: string, message: Message) {
    this.getGoogleMavenRepositoriesInstance()
      .get(
        AndroidRepositoryManager.ANDROID_MAVEN_PATH +
          AndroidRepositoryManager.ANDROID_ALL_LIBRARIES,
      )
      .then((response) => {
        this.validatePackagesResponse(response.data.toString(), message).catch(
          (exception) => {
            ApplicationUtils.printAppLog(
              'Error Triggered : ' + ' Exception : ' + exception,
            );
          },
        );
      })
      .catch((ex) => {
        ApplicationUtils.printAppLog(ex);
        message.reply('Something Wrong With Google Maven Repository');
      });
  }

  /**
   * This Method Will Loop on All Packages Returned from getAllPackages() To Filter The Packages and Remove Un Used Lines
   * To Get Just Groups id's
   * Then Will get All Artifacts and Versions for Each Group Id Via getLibrariesVersions()
   * @param response
   * @private
   */
  private async validatePackagesResponse(response: string, message: Message) {
    xml2js.parseString(response, (err, result) => {
      if (err) {
        throw err;
      }

      const json = JSON.stringify(result, null, 4);
      fs.writeFileSync(AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE, json);
      this.onValidateJsonContentVersions(result, message);
    });
  }

  private async onValidateJsonContentVersions(result: any, message: Message) {
    const librariesMap = new Map(Object.entries(result.metadata));
    for (const key of librariesMap.keys()) {
      await this.getLibraryInformation(key, message);
    }
  }

  private async getLibraryInformation(name: string, message: Message) {
    await this.getGoogleMavenRepositoriesInstance()
      .get(
        AndroidRepositoryManager.ANDROID_MAVEN_PATH +
          name.split('.').join('/').trim() +
          AndroidRepositoryManager.GROUP_ARTIFACTS,
        {
          method: 'get',
        },
      )
      .then((response) => {
        this.validateLibraryVersionArtifacts(
          response.data.toString(),
          name,
          message,
        );
      })
      .catch((exception) => {
        ApplicationUtils.printAppLog(
          AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' Exception : ' +
            exception,
        );
      });
  }

  private async validateLibraryVersionArtifacts(
    content: string,
    library: string,
    message: Message,
  ) {
    xml2js.parseString(content, (err, result) => {
      if (err) {
        throw err;
      }

      const librariesMap = new Map(Object.entries(result));
      for (const key of librariesMap.keys()) {
        // await this.getLibraryInformation(key);
        if (librariesMap.has(key)) {
          const artifacts = new Map(Object.entries(librariesMap.get(key)));
          for (const key of artifacts.keys()) {
            const artifact = artifacts.get(key);
            const artifactVersionsContainer = new Map(Object.entries(artifact));
            const versions = new Map(
              Object.entries(artifactVersionsContainer.get('0')),
            ).get('$');
            const version = new Map(Object.entries(versions))
              .get('versions')
              .toString();
            if (version.includes(',')) {
              this.onValidateLibraryVersion(
                library,
                key,
                version.split(',')[0],
                message,
              );
            } else {
              this.onValidateLibraryVersion(library, key, version, message);
            }
          }
        }
      }
    });
  }

  private async onValidateLibraryVersion(
    library: string,
    artifact: string,
    version: string,
    message: Message,
  ) {
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

  private getMessage(name: string, artifact: string, version: string): string {
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
