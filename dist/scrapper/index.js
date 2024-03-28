import { ScrapperModIoAlienTag } from './modio.js';
export var AvailableScrappers;
(function (AvailableScrappers) {
    AvailableScrappers["modioAlienTag"] = "mod.io/AlienTag";
})(AvailableScrappers || (AvailableScrappers = {}));
export class Scrape {
    static scrappers = new Map();
    static async scrape(scrapper) {
        if (!this.scrappers.has(scrapper))
            throw new Error(`${scrapper} does not exist`);
        return await this.scrappers.get(scrapper).scrape();
    }
    static register(scrapper, name) {
        this.scrappers.set(name, scrapper);
    }
}
Scrape.register(new ScrapperModIoAlienTag(), AvailableScrappers.modioAlienTag);
