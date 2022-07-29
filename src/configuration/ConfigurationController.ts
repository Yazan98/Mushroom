import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigurationService } from './ConfigurationService';

@Controller('/config')
export class ConfigurationController {
  @Inject()
  private service: ConfigurationService;
  @Get('/files')
  getGeneratedConfigurationFiles() {
    this.service.generateJsonTemplates();
    return true;
  }
}
