import { Module } from '@nestjs/common';
import { ConfigurationService } from './ConfigurationService';
import { ConfigurationController } from './ConfigurationController';
import { HttpModule } from '@nestjs/axios/dist/http.module';

@Module({
  imports: [HttpModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [],
})
export class ConfigurationModule {}
