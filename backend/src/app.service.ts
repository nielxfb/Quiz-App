import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getServerTime(): { serverTime: string } {
    return { serverTime: new Date().toISOString() };
  }
}
