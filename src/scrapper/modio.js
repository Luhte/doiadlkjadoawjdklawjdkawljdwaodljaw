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
exports.ScrapperModIoAlienTag = void 0;
var index_js_1 = require("./index.js");
var axios_1 = require("axios");
var database_js_1 = require("../database/database.js");
var notified_maps_js_1 = require("../database/models/notified-maps.js");
var log_js_1 = require("../log.js");
var log = (0, log_js_1.create)('scrapper/modio');
// there is an API available for this
var ScrapperModIoAlienTag = /** @class */ (function () {
    function ScrapperModIoAlienTag() {
    }
    ScrapperModIoAlienTag.prototype.scrape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, mods, parsedMods, notified, filtered, _i, parsedMods_1, mod, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://mod.io/v1/games/@alientag/mods?_limit=100&_offset=0&_sort=-date_live', {
                                headers: {
                                    Accept: 'Application/json',
                                    Referer: 'https://mod.io/g/alientag',
                                    Agent: '',
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                                    'Accept-Language': 'en-US,en;q=0.5',
                                    'X-Modio-Origin': 'web',
                                    'Sec-GPC': '1',
                                    'Sec-Fetch-Dest': 'empty',
                                    'Sec-Fetch-Mode': 'cors',
                                    'Sec-Fetch-Site': 'same-origin',
                                },
                                withCredentials: true,
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data.error)
                            throw new Error('API Error: ' + response.data.error.message);
                        mods = response.data.data;
                        parsedMods = mods.map(function (mod) {
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
                        notified = database_js_1.default.findOneOptional(notified_maps_js_1.NotifiedMaps, {
                            where: {
                                clause: 'scraper = ?',
                                values: [index_js_1.AvailableScrappers.modioAlienTag],
                            },
                        });
                        notified.scraper = index_js_1.AvailableScrappers.modioAlienTag;
                        filtered = [];
                        if (parsedMods.length > 0) {
                            for (_i = 0, parsedMods_1 = parsedMods; _i < parsedMods_1.length; _i++) {
                                mod = parsedMods_1[_i];
                                // check if it is new
                                if (!notified._new && mod.liveDate <= notified.lastDateLive)
                                    continue;
                                filtered.push(mod);
                            }
                            notified.lastDateLive = parsedMods[0].liveDate;
                        }
                        if (notified._new) {
                            log.info('did initial scrape');
                        }
                        database_js_1.default.save(notified);
                        return [2 /*return*/, filtered];
                    case 2:
                        e_1 = _a.sent();
                        log.error('failed to fetch data from mod.io', e_1);
                        throw new Error("Couldn't fetch data from mod.io.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ScrapperModIoAlienTag;
}());
exports.ScrapperModIoAlienTag = ScrapperModIoAlienTag;
