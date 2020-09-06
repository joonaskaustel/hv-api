import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemService } from '../item/item.service';

@Injectable()
export class TaskService {
    constructor(
      private itemService: ItemService,
    ) {}

    private readonly logger = new Logger(TaskService.name);

    // CronExpression.EVERY_DAY_AT_6PM
    @Cron(CronExpression.EVERY_30_MINUTES)
    async updatePrices(): Promise<void> {
       await this.itemService.updatePrices();
    };
}