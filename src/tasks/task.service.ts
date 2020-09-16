import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemService } from '../item/item.service';

@Injectable()
export class TaskService {
    constructor(
      private itemService: ItemService,
      private httpService: HttpService,
    ) {
    }

    @Cron(CronExpression.EVERY_4_HOURS)
    async updatePrices(): Promise<void> {
        await this.itemService.updatePrices();
    }
}