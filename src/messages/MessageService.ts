import { Injectable } from '@nestjs/common';
import { MessageServiceImplementation } from './MessageServiceImplementation';

@Injectable()
export class MessageService implements MessageServiceImplementation {}
