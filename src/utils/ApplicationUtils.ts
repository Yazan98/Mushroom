import { Logger } from '@nestjs/common';

export class ApplicationUtils {
  private static logger = new Logger('ApplicationUtils');

  static printAppLog(message: string) {
    this.logger.log(message);
  }
}
