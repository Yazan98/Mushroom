import { Module } from '@nestjs/common';
import { ConfigurationService } from './ConfigurationService';
import { ConfigurationController } from './ConfigurationController';

@Module({
  imports: [],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [],
})
export class ConfigurationModule {}
