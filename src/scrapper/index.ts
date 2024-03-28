import { ScrapperModIoAlienTag } from './modio.js';

export enum AvailableScrappers {
    modioAlienTag = 'mod.io/AlienTag',
}

export interface ScrapedData {
    id: number;
    name: string;
    downloads: string;
    size: number;
    thumbnail: string;
    description: string;
    author: string;
    link: string;
    liveDate: number;
}

export interface Scrapper {
    scrape(): Promise<ScrapedData[]>;
}

export class Scrape {
    private static scrappers: Map<AvailableScrappers, Scrapper> = new Map();

    public static async scrape(scrapper: AvailableScrappers): Promise<ScrapedData[]> {
        if (!this.scrappers.has(scrapper)) throw new Error(`${scrapper} does not exist`);

        return await this.scrappers.get(scrapper)!.scrape();
    }

    public static register(scrapper: Scrapper, name: AvailableScrappers) {
        this.scrappers.set(name, scrapper);
    }
}

Scrape.register(new ScrapperModIoAlienTag(), AvailableScrappers.modioAlienTag);
