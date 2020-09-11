import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Item} from './item.entity';
import * as puppeteer from 'puppeteer';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class ItemService {
    constructor(
      @InjectRepository(Item)
      private repository: Repository<Item>,
    ) {}

    findAll(): Promise<Item[]> {
        return this.repository.find();
    }

    findOne(id: string): Promise<Item> {
        return this.repository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async updatePrices(): Promise<void> {
        // get all items
        const allItems = await this.repository.find();

        for (const item of allItems) {
            await this.retrieveItemPriceFromLink(item.urlLink);
        }
    }

    async retrieveItemPriceFromLink(link: string): Promise<number> {

        // puppeteer setup
        const browser = await puppeteer.launch({
            args : [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.goto(link, {waitUntil: 'networkidle2'});


        // use puppeteers evaluate method to retrieve elements
        const data = await page.evaluate(() => {

            // get main prices by using their class name
            const prices = Array.from(document.getElementsByClassName('extra-offers-price'), e => {
                // after base price element is retrieved, get attribute to get price without currency
                return parseFloat(e.getAttribute('data-price'));
            })

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const imageUrl = document.querySelector('p[class="inner product-image"] > a[class="modal-image cboxElement"]').href;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const name = document.querySelector('p[class="inner product-image"] > a[class="modal-image cboxElement"]').title;

            return {
                prices,
                imageUrl,
                name
            }
        });

        await browser.close();

        // get lowest price
        const currentLowestPrice = Math.min(...data.prices);

        // check if item is already in db
        const presentItem = await this.repository.findOne({ urlLink: link})

        // if not then save
        if (!presentItem) {
            await this.repository.save({ name: data.name, price: currentLowestPrice, urlLink: link, imageUrl: data.imageUrl })
        } else {
            // check if current price is lower than previous checked price
            if (currentLowestPrice < presentItem.price) {
                console.log('saadan meili')
                // notify user when price is cheaper
                SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: 'joonas.kaustel@gmail.com',
                    from: 'hinnasula@sula.com',
                    subject: 'Hinnateavitus',
                    text: `Toode ${link} on nüüd odavam ja maksab ${currentLowestPrice}€`,
                    html: `<strong>Toode ${link} on nüüd odavam ja maksab  ${currentLowestPrice}€</strong>`,
                };
                await SendGrid.send(msg);
            }

            // update items price
            await this.repository.update(presentItem.id, { price: currentLowestPrice });

        }

        return currentLowestPrice;
    }
}