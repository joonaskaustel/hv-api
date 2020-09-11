import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const accessToken: string = req.user.accessToken;
        if (accessToken)
            res.redirect('http://localhost:3000/login/succes/' + accessToken);
        else
            res.redirect('http://localhost:3000/login/failure');
        return await this.googleService.googleLogin(req, res)
  }
}