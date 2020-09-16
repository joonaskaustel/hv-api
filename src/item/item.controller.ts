import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { RetrievePriceDto } from './dto/retrievePriceDto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly userService: UserService,
    ) {}

    @Post()
    async insertAndSubscribe(@Body() body: RetrievePriceDto, @Req() req): Promise<any> {
        const googleId = req.user.googleId;
        return this.itemService.saveUserItem(body.link, googleId);
    }

    @Get()
    async getItems(@Req() req): Promise<any> {
        const googleId = req.user.googleId;
        return this.userService.findUserItemsByGoogleId(googleId);
    }

    @Get('user')
    async getUserItems(): Promise<any> {
        return [];
    }
}