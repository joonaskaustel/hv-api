import { IsNotEmpty } from 'class-validator';

export class RetrievePriceDto {
    @IsNotEmpty()
    link: string;
}