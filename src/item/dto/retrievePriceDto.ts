import { IsNotEmpty, Matches } from 'class-validator';

export class RetrievePriceDto {
    @IsNotEmpty()
    @Matches(/https:\/\/www.hinnavaatlus.ee\/[0-9]*\/[a-zA-Z-0-9]*\/$/i)
    link: string;
}