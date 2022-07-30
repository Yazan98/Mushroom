import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { GithubRepositoryTag } from '../models/GithubRepositoryTag';
import * as fs from 'fs';

export class GithubRepositoriesTagsManager extends DependencyManager {
  constructor(
    private readonly httpService: HttpService,
    private readonly fileName: string,
    private readonly mode: string,
    private readonly cacheFile: string,
  ) {
    super();
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
            this.onUpdateMessageSend(
              message,
              libraryName,
              data[0].name,
              data[0].commit.url,
              data[0].zipball_url,
            );
          }
        }
      })
      .catch((ex) => {
        console.error(ex);
        message.reply(
          'Something Wrong While Processing ' +
            this.mode +
            ' Libraries : ' +
            ex.message,
        );
      });
  }

  private onUpdateMessageSend(
    message: Message,
    name: string,
    version: string,
    commit: string,
    link: string,
  ) {
    let response = '';
    response += 'Library New Version Available : ' + name + '\n';
    response += 'Library Version : ' + version + '\n';
    response += 'Library Commit : ' + commit + '\n';
    response += 'Library Link : ' + link + '\n';
    message.reply(response);
  }
}
