import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  seyHi(): string{
    return 'Hi node.js and nest.js';
  }
}
