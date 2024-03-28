import db from '../database/database.js';
import { GuildSettings } from '../database/models/guild-settings.js';
import { AvailableScrappers, Scrape, ScrapedData } from '../scrapper/index.js';
import { CronJob } from 'cron';
import Events from './events.js';
import { create } from '../log.js';
import { Client, EmbedBuilder, Routes } from 'discord.js';
import * as constants from '../constants.js';
import { formatFileSize, sleep } from '../util.js';
const log = create('scrape-notifier');

function buildEmbed(data: ScrapedData): EmbedBuilder {
    const embed = new EmbedBuilder();

    embed.setColor(constants.colorNotify);
    embed.setTitle(data.name);
    embed.setDescription(data.description);
    embed.setURL(data.link);
    embed.setImage(data.thumbnail);
    embed.setAuthor({
        name: data.author,
    });

    embed.addFields(
        {
            name: 'Downloads',
            value: `\`${data.downloads}\``,
            inline: true,
        },
        {
            name: 'Size',
            value: `\`${formatFileSize(data.size)}\``,
            inline: true,
        }
    );

    return embed;
}

export async function scrapeForGuild(guildId: Snowflake, client: Client<true>, scraped: ScrapedData[]) {
    const settings = db.findOneOptional(GuildSettings, {
        where: {
            clause: 'guildId = ?',
            values: [guildId],
        },
    });

    if (settings._new) return;

    const notifyEmbeds = [];
    for (const scrape of scraped) {
        notifyEmbeds.push(buildEmbed(scrape));
    }

    log.info(`found ${notifyEmbeds.length} new maps for guild ${guildId}`);

    for (let i = 0; i < notifyEmbeds.length; i += 10) {
        const embeds = notifyEmbeds.slice(i, i + 10);

        let content: string | undefined = undefined;
        if (i == 0) {
            if (notifyEmbeds.length === 1) {
                content = `<@&${settings.notifyRole}> A New Custom Map has been released!`;
            } else {
                content = `<@&${settings.notifyRole}> ${notifyEmbeds.length} New Custom Maps have been released!`;
            }
        }

        await client.rest.post(Routes.channelMessages(settings.notifyChannel), {
            body: {
                embeds: embeds.map((e) => e.toJSON()),
                content,
            },
        });
    }
}

Events.on('botReady', (client) => {
    log.info('starting notifier cron job for new maps');
    const job = new CronJob('*/10 * * * *', async () => {
        // add some random delay to avoid a potential ip ban
        await sleep(1000 * 30 * Math.round(Math.random() * 10));

        for (const scraper of Object.values(AvailableScrappers)) {
            const scraped = await Scrape.scrape(scraper);

            if (scraped.length == 0) continue;
            for (const [guildId] of client.guilds.cache.entries()) {
                await scrapeForGuild(guildId, client, scraped);
            }
        }
    });

    job.start();
});
