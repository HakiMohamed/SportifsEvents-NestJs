import { Controller, Get } from '@nestjs/common';

@Controller('hello')
export class HelloController {

  @Get() 
  sayHello(): string {
    return 'hello';
  }
}
