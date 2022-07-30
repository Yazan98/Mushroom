import { HttpService } from '@nestjs/axios';
import { DependencyManager } from './DependencyManager';
import { Message } from 'discord.js';
import * as fs from 'fs';

import {
  GoogleCacheArtifact,
  GoogleMavenArtifact,
  GoogleMavenLibrary,
} from '../models/GoogleMavenLibrary';
import { timer } from 'rxjs';
import { LibraryUpdateModel } from '../models/LibraryUpdateModel';

export class AndroidRepositoryManager extends DependencyManager {
  public static ANDROID_MAVEN_PATH = '/android/maven2/';
  public static ANDROID_ALL_LIBRARIES = 'master-index.xml';
  public static GROUP_ARTIFACTS = '/group-index.xml';
  private static CONSOLE_LOGGING_KEY = '[Google Dependencies]';
  private static SKIP_META_DATA_TAG = 'metadata';
  private static SKIP_XML_HEADER_TAG = "xml version='1.0'";
  private static GOOGLE_LIBRARIES_FILE =
    process.cwd() + '/libraries/google-libraries.json';
  private static GOOGLE_LIBRARIES_CACHE_FILE =
    process.cwd() + '/libraries/google-cache.json';

  constructor(private readonly httpService: HttpService) {
    super();
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
            console.error('Error Triggered : ' + ' Exception : ' + exception);
          },
        );
      })
      .catch((ex) => {
        console.error(ex);
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
    console.log(
      AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
        ' Start Validating Response ===================================',
    );
    const librariesArray: Array<string> = new Array<string>();
    const responseValue = response.split('\n');
    for (let i = 0; i < responseValue.length; i++) {
      if (
        !responseValue[i].includes(
          AndroidRepositoryManager.SKIP_XML_HEADER_TAG,
        ) &&
        !responseValue[i].includes(AndroidRepositoryManager.SKIP_META_DATA_TAG)
      ) {
        const targetValue = responseValue[i].replace('<', '').replace('/>', '');
        console.log(
          AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
            ' Library : ' +
            targetValue,
        );
        librariesArray.push(targetValue);
      }
    }

    await this.getLibrariesVersions(librariesArray, message);
    console.log(
      AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
        ' End Validating Response ===================================',
    );
  }

  /**
   * This Method Will Loop on All Groups To Get All Artifacts and Versions of the Group Id
   * And Filter Them Then Add Them to Filtered Array With (GroupId, Artifacts, Versions)
   * @param libraries
   * @private
   */
  private async getLibrariesVersions(
    libraries: Array<string>,
    message: Message,
  ) {
    if (libraries == null) {
      return;
    }

    const librariesArray: Array<GoogleMavenLibrary> =
      new Array<GoogleMavenLibrary>();
    console.log(
      AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
        ' Start Getting Libraries Versions ===================================',
    );
    for (let i = 0; i < libraries.length; i++) {
      if (libraries[i] === '') {
        continue;
      }

      await timer(1000);
      console.log('Start Validating Group Index For Path : ' + libraries[i]);
      await this.getGoogleMavenRepositoriesInstance()
        .get(
          AndroidRepositoryManager.ANDROID_MAVEN_PATH +
            libraries[i].split('.').join('/').trim() +
            AndroidRepositoryManager.GROUP_ARTIFACTS,
          {
            method: 'get',
          },
        )
        .then((response) => {
          const artifacts = this.getArtifactsByGroupRequest(
            response.data.toString().split('\n'),
          );
          librariesArray.push({
            groupId: libraries[i],
            artifacts: artifacts,
          });
        })
        .catch((exception) => {
          console.error(
            AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
              ' Exception : ' +
              exception,
          );
        });
    }

    this.validateLibrariesUpdatedVersions(librariesArray, message);
    console.log(
      AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
        ' End Getting Libraries Versions ===================================',
    );
  }

  /**
   * Artifacts Names and Versions Returned in Same Xml File
   * Need To Split all of Them and Remove UnNessessary Lines
   * Then Filter All of them to return Artifacts Returned From Group Id
   * @param response
   * @private
   */
  private getArtifactsByGroupRequest(
    response: Array<string>,
  ): Array<GoogleMavenArtifact> {
    const artifacts = Array<GoogleMavenArtifact>();
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

  /**
   * Here is the Last Point from Google Maven Repositories Libraries
   * After Loop on all of them to get All Artifacts, Versions of Artifacts
   * Will Start Validating Via Cached Versions in Last Update Inside Saved Json File
   *
   * Will check If the File is not Exists Will Push All Messages to Slack Channel with The Latest Versions of Each Group
   * If the Json File Exists, Will Check The Cached Version of Each Library and if the Library Has new Version Will Send Slack Message
   * With Provided Application Token in Json File Too
   * @param librariesArray
   * @private
   */
  private validateLibrariesUpdatedVersions(
    librariesArray: Array<GoogleMavenLibrary>,
    message: Message,
  ) {
    this.createGoogleLibrariesFile(librariesArray);

    if (!fs.existsSync(AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE)) {
      AndroidRepositoryManager.createGoogleCacheFile(librariesArray);
    } else {
      this.validateUpdatedLibraries(librariesArray, message);
    }
  }

  private validateUpdatedLibraries(
    librariesArray: Array<GoogleMavenLibrary>,
    message: Message,
  ) {
    fs.readFile(
      AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE,
      'utf8',
      function readFileCallback(err, data) {
        if (err) {
          console.log(err);
        } else {
          AndroidRepositoryManager.validateUpdatedDependencies(
            data,
            librariesArray,
            message,
          );
          AndroidRepositoryManager.createGoogleCacheFile(librariesArray);
        }
      },
    );
  }

  /**
   * IT's just a Temp File to Save All Google Libraries inside Json File
   * @param librariesArray
   * @private
   */
  private createGoogleLibrariesFile(librariesArray: Array<GoogleMavenLibrary>) {
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
    fs.writeFile(
      AndroidRepositoryManager.GOOGLE_LIBRARIES_FILE,
      json,
      'utf8',
      (exception) => {
        if (exception != null) {
          console.error(
            AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
              ' Exception : ' +
              exception,
          );
        }
      },
    );
  }

  /**
   * Create Google Cache File with Latest Libraries Versions
   * This File if Not Exists Will Create new One for First Time
   * Then Will Update It After Checking The Version of the New Response Inside Libraries Array
   * @param librariesArray
   * @private
   */
  public static createGoogleCacheFile(
    librariesArray: Array<GoogleMavenLibrary>,
  ) {
    const googleCacheObject = {
      libraries: [],
    };

    for (let i = 0; i < librariesArray.length; i++) {
      const library = librariesArray[i];
      const artifacts = Array<GoogleCacheArtifact>();
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
    fs.writeFile(
      AndroidRepositoryManager.GOOGLE_LIBRARIES_CACHE_FILE,
      json,
      'utf8',
      (exception) => {
        if (exception != null) {
          console.error(
            AndroidRepositoryManager.CONSOLE_LOGGING_KEY +
              ' Exception : ' +
              exception,
          );
        }
      },
    );
  }

  public static validateUpdatedDependencies(
    data: string,
    librariesArray: Array<GoogleMavenLibrary>,
    message: Message,
  ) {
    let googleCacheObject = {
      libraries: [],
    };

    const librariesToUpdate = new Array<LibraryUpdateModel>();
    googleCacheObject = JSON.parse(data);
    for (let i = 0; i < googleCacheObject.libraries.length; i++) {
      const library = googleCacheObject.libraries[i];
      for (let j = 0; j < librariesArray.length; j++) {
        const newLibrary = librariesArray[i];
        if (newLibrary.groupId.includes(library.groupId)) {
          if (
            newLibrary.artifacts[0].versions[0] !== library.artifacts[0].version
          ) {
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

  private static onSendMessagesGoogleMavenUpdate(
    librariesToUpdate: Array<LibraryUpdateModel>,
    message: Message,
  ) {
    if (librariesToUpdate.length == 0) {
      message.reply('Google Maven Central No Artifact Updated !!');
      return;
    }

    for (let i = 0; i < librariesToUpdate.length; i++) {
      this.onSendMessage(message, librariesToUpdate[i]);
    }
  }

  private static onSendMessage(message: Message, model: LibraryUpdateModel) {
    let response = '';
    response += '============= Library Update Start =============' + ' \n';
    response += 'Library Update : ' + model.artifact + ' \n';
    response += 'Library Group Id : ' + model.groupId + ' \n';
    response += 'Library Version : ' + model.version + ' \n';
    response += '============= Library Update End =============' + ' \n';
    message.reply(response);
  }
}