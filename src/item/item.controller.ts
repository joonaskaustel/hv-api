import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { RetrievePriceDto } from './dto/retrievePriceDto';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post()
    async retrieveItemPriceFromLink(@Body() body: RetrievePriceDto): Promise<any> {
        console.log('link: ', body.link)
        return this.itemService.retrieveItemPriceFromLink(body.link);
    }

    @Get()
    async getItems(): Promise<any> {
        return this.itemService.findAll();
    }
}