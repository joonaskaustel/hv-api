import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { RetrievePriceDto } from './dto/retrievePriceDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async retrieveItemPriceFromLink(@Body() body: RetrievePriceDto): Promise<any> {
        console.log('fdasdfasdf')
        return this.itemService.retrieveItemPriceFromLink(body.link);
    }

    @Get()
    async getItems(): Promise<any> {
        return this.itemService.findAll();
    }

    @Get('user')
    async getUserItems(): Promise<any> {
        return [];
    }
}