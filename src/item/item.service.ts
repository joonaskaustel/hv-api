import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from './item.entity';
import * as puppeteer from 'puppeteer';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import {EvaluateFnReturnType} from "puppeteer";

@Injectable()
export class ItemService {
    private alias = 'i';
    constructor(
      @InjectRepository(Item)
      private repository: Repository<Item>,
      private userService: UserService,
      private emailService: EmailService,
    ) {}

    async createQueryBuilder(): Promise<SelectQueryBuilder<Item>> {
        return getRepository(Item).createQueryBuilder(`${this.alias}`)
          .leftJoinAndSelect(`"${this.alias}".users`, 'u')
          ;
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async updatePrices(): Promise<void> {
        // get all items
        const allItems = await this.repository.find();

        for (const item of allItems) {
            const currentItem = await this.retrieveItemFromLink(item.urlLink);
            await this.updateItemPrice(item.urlLink, currentItem.lowestPrice);
        }

        return;
    }

    async saveUserItem(link, googleId): Promise<any> {
        // get user by google id
        const user = await this.userService.findOneByGoogleId(googleId);

        // check if user already has this item
        const userHasItem = user.items.find((i) => i.urlLink === link);

        if (userHasItem) {
            return userHasItem;
        }

        // get item price
        const item = await this.retrieveItemFromLink(link);

        // check if item is already present in db
        const presentItem = await this.repository.findOne({ urlLink: link}, { relations: ['users'] });

        // if item is not present, create new. else attach current user to item users
        if (!presentItem) {
            const newItem = new Item();
            newItem.price = item.lowestPrice;
            newItem.imageUrl = item.imageUrl;
            newItem.urlLink = link;
            newItem.name = item.name;
            newItem.users = [user];
            return await this.repository.save(newItem);
        } else {
            const users = presentItem.users;
            users.push(user);
            presentItem.users = users;
            return await this.repository.save(presentItem);
        }
    }

    async retrieveItemFromLink(link): Promise<EvaluateFnReturnType<() => { lowestPrice: number; imageUrl: string; name: string }>> {
        // puppeteer setup
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        await page.goto(link);

        // use puppeteers evaluate method to retrieve elements
        const data = await page.evaluate(() => {

            // get main prices by using their class name
            const prices = Array.from(document.getElementsByClassName('extra-offers-price'), e => {
                // after base price element is retrieved, get attribute to get price without currency
                return parseFloat(e.getAttribute('data-price'));
            })
            const lowestPrice = Math.min(...prices);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const imageUrl = document.querySelector('p[class="inner product-image"] > a[class="modal-image cboxElement"]')?.href;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const name = document.querySelector('p[class="inner product-image"] > a[class="modal-image cboxElement"]')?.title;

            return {
                lowestPrice,
                imageUrl,
                name
            }
        });

        await browser.close();
        return data;
    }

    async updateItemPrice(link: string, newPrice: number): Promise<number> {
        // check if item is already in db
        const presentItem = await this.repository.findOne({ urlLink: link}, { relations: ['users'] })

        // if not then exit
        if (!presentItem) {
            return;
        }

        // check if price is lower and then notify user
        if (newPrice < presentItem.price) {
            presentItem.users.forEach((user) => {
                this.emailService.sendPriceNotificationEmail(link, user.email, newPrice);
            });
        }

        // update items price
        presentItem.price = newPrice;
        await this.repository.save(presentItem);

        return newPrice;
    }
}