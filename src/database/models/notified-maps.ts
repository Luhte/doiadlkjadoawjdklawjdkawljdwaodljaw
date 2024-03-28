import { AvailableScrappers } from '../../scrapper/index.js';
import { orm } from '../database.js';
import { SqlTable } from 'node-sqlite-orm';

@orm.model()
export class NotifiedMaps extends SqlTable {
    mods: number[] = [];

    @orm.columnType('string')
    scraper!: AvailableScrappers;

    lastDateLive: number = 0;
}
