import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
    constructor() {
    }

    async getHello(link: string): Promise<number> {

        // puppeteer setup
        const browser = await puppeteer.launch({
            'args' : [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.goto(link);

        // use puppeteers evaluate method to retrieve elements
        const prices = await page.evaluate(() => {
            // get main prices by using their class name
            return Array.from(document.getElementsByClassName('extra-offers-price'), e => {
                // after base price element is retrieved, get attribute to get price without currency
                return parseFloat(e.getAttribute('data-price'))
            })
        });

        browser.close();

        // get lowest price
        const lowestPrice = Math.min(...prices);

        console.log('prices ', prices)

        return lowestPrice;
    }
}
