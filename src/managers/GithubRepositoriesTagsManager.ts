import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepositoryTag } from '../models/GithubRepositoryTag';
import { LibraryVersionCache } from '../models/LibraryVersionCache';
import { CacheFileManager } from './CacheFileManager';
import { ApplicationUtils } from '../utils/ApplicationUtils';
import { ConfigService } from '@nestjs/config';

export class GithubRepositoriesTagsManager extends DependencyManager {
  private cachedLibraries: Array<LibraryVersionCache> = null;
  private cacheManager: CacheFileManager = null;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
    private readonly fileName: string,
    private readonly mode: string,
    private readonly cacheFile: string,
  ) {
    super(configService);
    this.cacheManager = new CacheFileManager(cacheFile);
    this.cachedLibraries = this.cacheManager.onPrepareCacheFileLibraries();
  }

  onImplementAction(event: string, message: Message) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const targetFile = fs.readFileSync(this.fileName);
    const libraries = JSON.parse(targetFile).libraries;
    for (let i = 0; i < libraries.length; i++) {
      this.onRepositoryRequest(
        message,
        libraries[i].name,
        libraries[i].version,
      );
    }
  }

  private onRepositoryRequest(
    message: Message,
    libraryName: string,
    version: string,
  ) {
    this.httpService.axiosRef
      .get<GithubRepositoryTag[]>(
        'repos/' + libraryName + '/tags',
        this.getRequestConfig(),
      )
      .then((result) => {
        const data = result.data;
        if (data == null || data.length == 0) {
          message.reply(
            'Library ' +
              libraryName +
              ' Does not Contain Any Available Tags !!',
          );
        } else {
          if (data[0].name !== version) {
            this.onUpdateMessageSend(message, libraryName, data[0].name);
          }
        }
      })
      .catch((ex) => {
        ApplicationUtils.printAppLog(ex);
        message.reply(
          'Something Wrong While Processing ' +
            this.mode +
            ' Libraries : ' +
            ex.message,
        );
      });
  }

  private onUpdateMessageSend(message: Message, name: string, version: string) {
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

  private getLibraryUpdateMessage(name: string, version: string): string {
    let response = '';
    response += 'Library New Version Available : ' + name + '\n';
    response += 'Library Version : ' + version + '\n';
    response += 'Github Link : ' + `https://github.com/${name}` + '\n';
    response +=
      'Github Link Releases : ' + `https://github.com/${name}/releases` + '\n';
    return response;
  }
}
