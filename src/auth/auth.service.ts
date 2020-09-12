import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

export enum Provider {
    GOOGLE = 'google'
}

@Injectable()
export class AuthService {

    private readonly JWT_SECRET_KEY = 'VERY_SECRET_KEY'; // <- replace this with your secret key

    constructor(private readonly userService: UserService) {
    };

    async validateOAuthLogin(email: string, firstName: string, lastName: string, googleId: string, provider: Provider): Promise<string> {
        try {
            // You can add some registration logic here,
            // to register the user using their thirdPartyId (in this case their googleId)
            let user: User = await this.userService.findOneByGoogleId(googleId);

            if (!user) {
                const newUser = new User();
                newUser.googleId = googleId;
                newUser.email = email;
                newUser.firstName = firstName;
                newUser.lastName = lastName;
                user = await this.userService.save(newUser);
            }

            const payload = {
                googleId,
                provider,
            };

            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
            return jwt;
        } catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }

}