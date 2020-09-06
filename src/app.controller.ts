import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    getConfirmation(): string {
        return 'Api works'
    }
}
