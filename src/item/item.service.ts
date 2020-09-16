import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Item } from './item.entity';
import * as puppeteer from 'puppeteer';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

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

        allItems.forEach(async (item) => {
            const currentPrice = await this.retrieveLowestPriceFromLink(item.urlLink);
            await this.updateItemPrice(item.urlLink, currentPrice);
        });

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
        const itemPrice = await this.retrieveLowestPriceFromLink(link);

        // check if item is already present in db
        const presentItem = await this.repository.findOne({ urlLink: link}, { relations: ['users'] });

        // if item is not present, create new. else attach current user to item users
        if (!presentItem) {
            const newItem = new Item();
            newItem.price = itemPrice;
            newItem.urlLink = link;
            newItem.name = link;
            newItem.users = [user];
            return await this.repository.save(newItem);
        } else {
            const users = presentItem.users;
            users.push(user);
            presentItem.users = users;
            return await this.repository.save(presentItem);
        }
    }

    async retrieveLowestPriceFromLink(link): Promise<number> {
        // puppeteer setup
        const browser = await puppeteer.launch({
            args : [
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
        return Math.min(...prices);
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