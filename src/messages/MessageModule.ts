import { Module } from '@nestjs/common';
import { MessageService } from './MessageService';

@Module({
  imports: [],
  exports: [],
  providers: [MessageService],
})
export class MessageModule {}
