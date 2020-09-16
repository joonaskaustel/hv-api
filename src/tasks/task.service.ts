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

    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updatePrices(): Promise<void> {
        await this.itemService.updatePrices();
    }
}