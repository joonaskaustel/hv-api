import { Controller, Get, HttpService, Query, Response } from '@nestjs/common';
import { AppService } from './app.service';
import * as express from 'express';
import * as puppeteer from 'puppeteer';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private httpService: HttpService) {
    }

    @Get()
    async getHello(@Query('link') link: string): Promise<any> {
        console.log('link: ', link);
        return 'yep'
    }
}
