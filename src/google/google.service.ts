import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../item/item.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class GoogleService {
    constructor(
        @InjectRepository(User)
        private userService: UserService,
    ) {}

    async googleLogin(req, res) {
        if (!req.user) {
            return 'No user from google'
        }

        console.log(req.user)


        // handles the Google OAuth2 callback
        const jwt: string = req.user.jwt;
        // if (jwt)
        //     res.redirect('http://localhost:4200/login/succes/' + jwt);
        // else
        //     res.redirect('http://localhost:4200/login/failure');

        // do user saving here ?
        const user = new User()
        user.email = req.user.email;
        user.firstName = req.user.firstName;
        user.lastName = req.user.lastName;
        await this.userService.save(user);

        return {
            user: user,
        }
    }
}