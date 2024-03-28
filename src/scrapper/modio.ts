import { AvailableScrappers, type ScrapedData, type Scrapper } from './index.js';
import axios from 'axios';
import db from '../database/database.js';
import { NotifiedMaps } from '../database/models/notified-maps.js';
import { create } from '../log.js';
const log = create('scrapper/modio');

// there is an API available for this
export class ScrapperModIoAlienTag implements Scrapper {
    public async scrape(): Promise<ScrapedData[]> {
        try {
            const response = await axios.get(
                'https://mod.io/v1/games/@alientag/mods?_limit=100&_offset=0&_sort=-date_live',
                {
                    headers: {
                        Accept: 'Application/json',
                        Referer: 'https://mod.io/g/alientag',
                        Agent: '',
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'X-Modio-Origin': 'web',
                        'Sec-GPC': '1',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                    },
                    withCredentials: true,
                }
            );

            if (response.data.error) throw new Error('API Error: ' + response.data.error.message);
            const mods = response.data.data;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsedMods = mods.map((mod: Record<string, any>) => {
                return {
                    id: mod.id,
                    name: mod.name,
                    downloads: mod.stats.downloads_total,
                    thumbnail: mod.logo.thumb_1280x720,
                    description: mod.summary,
                    author: mod.submitted_by.username,
                    link: mod.profile_url,
                    liveDate: mod.date_live,
                    size: mod.modfile.filesize,
                };
            });

            const notified = db.findOneOptional(NotifiedMaps, {
                where: {
                    clause: 'scraper = ?',
                    values: [AvailableScrappers.modioAlienTag],
                },
            });
            notified.scraper = AvailableScrappers.modioAlienTag;

            const filtered = [];
            if (parsedMods.length > 0) {
                for (const mod of parsedMods) {
                    // check if it is new
                    if (!notified._new && mod.liveDate <= notified.lastDateLive) continue;
                    filtered.push(mod);
                }
                notified.lastDateLive = parsedMods[0].liveDate;
            }

            if (notified._new) {
                log.info('did initial scrape');
            }

            db.save(notified);

            return filtered;
        } catch (e) {
            log.error('failed to fetch data from mod.io', e);
            throw new Error("Couldn't fetch data from mod.io.");
        }
    }
}
