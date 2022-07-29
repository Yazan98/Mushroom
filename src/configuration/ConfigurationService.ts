import { Injectable } from '@nestjs/common';
import { ConfigurationServiceImplementation } from './ConfigurationServiceImplementation';
import { Client } from 'discord.js';
import fs from 'fs';
import { ApplicationUtils } from '../utils/ApplicationUtils';

@Injectable()
export class ConfigurationService
  implements ConfigurationServiceImplementation
{
  public static ANDROID_JSON_FILE = process.cwd() + '/libraries/android.json';
  public static BACKEND_JSON_FILE = process.cwd() + '/libraries/backend.json';
  public static GENERAL_JSON_FILE = process.cwd() + '/libraries/general.json';

  getCurrentSupportedServices(): Array<string> {
    return undefined;
  }

  getDiscordApplicationToken(): string {
    return '';
  }

  getSlackApplicationToken(): string {
    return '';
  }

  getDiscordClient(): Client {
    return null;
  }

  executeDiscordClientListeners() {
    console.log('asfjaklnwed');
  }

  generateJsonTemplates(isForceGenerate: boolean) {
    const fs = require('fs');
    if (fs.existsSync(ConfigurationService.ANDROID_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.ANDROID_JSON_FILE} Already Exists ..`,
      );
    } else if (isForceGenerate) {
      fs.watchFile(ConfigurationService.ANDROID_JSON_FILE, () => {});
    }

    if (fs.existsSync(ConfigurationService.BACKEND_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.BACKEND_JSON_FILE} Already Exists ..`,
      );
    } else if (isForceGenerate) {
      fs.watchFile(ConfigurationService.BACKEND_JSON_FILE, () => {});
    }

    if (fs.existsSync(ConfigurationService.GENERAL_JSON_FILE)) {
      ApplicationUtils.printAppLog(
        `${ConfigurationService.GENERAL_JSON_FILE} Already Exists ..`,
      );
    } else if (isForceGenerate) {
      fs.watchFile(ConfigurationService.GENERAL_JSON_FILE, () => {});
    }
  }
}
