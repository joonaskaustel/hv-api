import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {

    async sendPriceNotificationEmail(link: string, userEmail: string, currentLowestPrice: number): Promise<void> {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: userEmail,
            from: 'hinnasula@sula.com',
            subject: 'Hinnateavitus',
            text: `Toode ${link} on nüüd odavam ja maksab ${currentLowestPrice}€`,
            html: `<strong>Toode ${link} on nüüd odavam ja maksab  ${currentLowestPrice}€</strong>`,
        };
        SendGrid.send(msg);
    }
}