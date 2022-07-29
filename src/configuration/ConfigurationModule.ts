import { Module } from '@nestjs/common';
import { ConfigurationService } from './ConfigurationService';

@Module({
  imports: [ConfigurationService],
  controllers: [],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
