"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeForGuild = void 0;
var database_js_1 = require("../database/database.js");
var guild_settings_js_1 = require("../database/models/guild-settings.js");
var index_js_1 = require("../scrapper/index.js");
var cron_1 = require("cron");
var events_js_1 = require("./events.js");
var log_js_1 = require("../log.js");
var discord_js_1 = require("discord.js");
var constants = require("../constants.js");
var util_js_1 = require("../util.js");
var log = (0, log_js_1.create)('scrape-notifier');
function buildEmbed(data) {
    var embed = new discord_js_1.EmbedBuilder();
    embed.setColor(constants.colorNotify);
    embed.setTitle(data.name);
    embed.setDescription(data.description);
    embed.setURL(data.link);
    embed.setImage(data.thumbnail);
    embed.setAuthor({
        name: data.author,
    });
    embed.addFields({
        name: 'Downloads',
        value: "`".concat(data.downloads, "`"),
        inline: true,
    }, {
        name: 'Size',
        value: "`".concat((0, util_js_1.formatFileSize)(data.size), "`"),
        inline: true,
    });
    return embed;
}
function scrapeForGuild(guildId, client, scraped) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, notifyEmbeds, _i, scraped_1, scrape, i, embeds, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = database_js_1.default.findOneOptional(guild_settings_js_1.GuildSettings, {
                        where: {
                            clause: 'guildId = ?',
                            values: [guildId],
                        },
                    });
                    if (settings._new)
                        return [2 /*return*/];
                    notifyEmbeds = [];
                    for (_i = 0, scraped_1 = scraped; _i < scraped_1.length; _i++) {
                        scrape = scraped_1[_i];
                        notifyEmbeds.push(buildEmbed(scrape));
                    }
                    log.info("found ".concat(notifyEmbeds.length, " new maps for guild ").concat(guildId));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < notifyEmbeds.length)) return [3 /*break*/, 4];
                    embeds = notifyEmbeds.slice(i, i + 10);
                    content = undefined;
                    if (i == 0) {
                        if (notifyEmbeds.length === 1) {
                            content = "<@&".concat(settings.notifyRole, "> A New Custom Map has been released!");
                        }
                        else {
                            content = "<@&".concat(settings.notifyRole, "> ").concat(notifyEmbeds.length, " New Custom Maps have been released!");
                        }
                    }
                    return [4 /*yield*/, client.rest.post(discord_js_1.Routes.channelMessages(settings.notifyChannel), {
                            body: {
                                embeds: embeds.map(function (e) { return e.toJSON(); }),
                                content: content,
                            },
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 10;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.scrapeForGuild = scrapeForGuild;
events_js_1.default.on('botReady', function (client) {
    log.info('starting notifier cron job for new maps');
    var job = new cron_1.CronJob('*/10 * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, scraper, scraped, _b, _c, guildId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // add some random delay to avoid a potential ip ban
                return [4 /*yield*/, (0, util_js_1.sleep)(1000 * 30 * Math.round(Math.random() * 10))];
                case 1:
                    // add some random delay to avoid a potential ip ban
                    _d.sent();
                    _i = 0, _a = Object.values(index_js_1.AvailableScrappers);
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    scraper = _a[_i];
                    return [4 /*yield*/, index_js_1.Scrape.scrape(scraper)];
                case 3:
                    scraped = _d.sent();
                    if (scraped.length == 0)
                        return [3 /*break*/, 7];
                    _b = 0, _c = client.guilds.cache.entries();
                    _d.label = 4;
                case 4:
                    if (!(_b < _c.length)) return [3 /*break*/, 7];
                    guildId = _c[_b][0];
                    return [4 /*yield*/, scrapeForGuild(guildId, client, scraped)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    job.start();
});
