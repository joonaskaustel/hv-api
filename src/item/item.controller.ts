import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get()
    async retrieveItemPriceFromLink(@Query('link') link: string): Promise<any> {
        console.log('link: ', link)
        return this.itemService.retrieveItemPriceFromLink(link);
    }

    @Get('/list')
    async getItems(): Promise<any> {
        return this.itemService.findAll();
    }
}