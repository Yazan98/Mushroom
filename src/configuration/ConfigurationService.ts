import { Injectable } from '@nestjs/common';
import { ConfigurationServiceImplementation } from './ConfigurationServiceImplementation';

@Injectable()
export class ConfigurationService
  implements ConfigurationServiceImplementation
{
  getCurrentSupportedServices(): Array<string> {
    return undefined;
  }

  getDiscordApplicationToken(): string {
    return '';
  }

  getSlackApplicationToken(): string {
    return '';
  }
}
