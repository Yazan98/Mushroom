import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ConfigurationService } from './ConfigurationService';

@Controller('/config')
export class ConfigurationController {
  @Inject()
  private service: ConfigurationService;
  @Get('/files')
  getGeneratedConfigurationFiles(@Query('force') isForce: boolean) {
    this.service.generateJsonTemplates(isForce);
    return true;
  }
}
