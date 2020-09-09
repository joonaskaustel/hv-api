import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemService } from '../item/item.service';
import * as chalk from 'chalk';

@Injectable()
export class TaskService {
    constructor(
      private itemService: ItemService,
      private httpService: HttpService,
    ) {
    }

    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_DAY_AT_7PM)
    async updatePrices(): Promise<void> {
        await this.itemService.updatePrices();
    };

    @Cron('*/20 * * * *')
    keepApiAlive(): void {
        console.log(chalk.white.bgCyan('POLLING API'));
        this.httpService.get('https://evening-crag-89603.herokuapp.com/');
    };
}