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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
var discord_js_1 = require("discord.js");
var discord_js_2 = require("discord.js");
var path_1 = require("path");
var fs_1 = require("fs");
var events_js_1 = require("./events.js");
var log_js_1 = require("../log.js");
var errors_js_1 = require("../errors.js");
var log = (0, log_js_1.create)('command-handler');
var commands = new Map();
function loadCommands(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var commandFiles, _i, commandFiles_1, file, commandData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.info('loading commands...');
                    commandFiles = fs_1.default.readdirSync(dir);
                    _i = 0, commandFiles_1 = commandFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < commandFiles_1.length)) return [3 /*break*/, 4];
                    file = commandFiles_1[_i];
                    return [4 /*yield*/, Promise.resolve("".concat(path_1.default.join(dir, file))).then(function (s) { return require(s); })];
                case 2:
                    commandData = _a.sent();
                    if ('disable' in commandData)
                        return [3 /*break*/, 3];
                    if (!('data' in commandData) || !('execute' in commandData)) {
                        throw new Error("error loading command file '".concat(file, "', missing command data & execute exports"));
                    }
                    commands.set(commandData.data.name, commandData);
                    log.info('loaded', commandData.data.name);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.loadCommands = loadCommands;
function registerCommands(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, guildId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log.info('sending commands to discord...');
                    _i = 0, _a = client.guilds.cache.keys();
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    guildId = _a[_i];
                    return [4 /*yield*/, registerCommandsGuild(client, guildId)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    log.info('slash commands updated');
                    return [2 /*return*/];
            }
        });
    });
}
function registerCommandsGuild(client, guildId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.info('sending commands to discord for guild', guildId);
                    return [4 /*yield*/, client.rest.put(discord_js_2.default.Routes.applicationGuildCommands(client.application.id, guildId), {
                            body: __spreadArray([], commands.values(), true).map(function (c) { return c.data.toJSON(); }),
                        })];
                case 1:
                    _a.sent();
                    log.info('updated commands for guild', guildId);
                    return [2 /*return*/];
            }
        });
    });
}
events_js_1.default.on('botReady', function (client) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(process.argv.includes('--reload-commands') || process.env.AUTO_RELOAD_COMMANDS)) return [3 /*break*/, 2];
                log.info('reloading commands...');
                return [4 /*yield*/, registerCommands(client)];
            case 1:
                _a.sent();
                if (process.argv.includes('--reload-commands'))
                    process.exit(0);
                return [3 /*break*/, 3];
            case 2:
                log.info('not reloading commands');
                _a.label = 3;
            case 3:
                client.on('guildCreate', function (guild) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, registerCommandsGuild(client, guild.id)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
                    var command, e_1, msg, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!interaction.isChatInputCommand())
                                    return [2 /*return*/];
                                command = commands.get(interaction.commandName);
                                if (command == null) {
                                    log.warn("received a command ".concat(interaction.commandName, " but the command was never registered"));
                                    return [2 /*return*/];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 11]);
                                log.info("running command /".concat(interaction.commandName, " from @").concat(interaction.user.username));
                                return [4 /*yield*/, command.execute(interaction)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 11];
                            case 3:
                                e_1 = _a.sent();
                                msg = 'Something went wrong, please contact maintainers, with what you did to get here';
                                // missing perm code
                                if (e_1 instanceof discord_js_1.DiscordAPIError && e_1.code.toString() === '50013') {
                                    msg = 'Missing permissions';
                                }
                                if (e_1 instanceof errors_js_1.UserError) {
                                    msg = e_1.message;
                                }
                                else {
                                    log.error('something went wrong while running slash command', interaction.commandName);
                                    log.error(e_1);
                                }
                                _a.label = 4;
                            case 4:
                                _a.trys.push([4, 9, , 10]);
                                if (!(interaction.replied || interaction.deferred)) return [3 /*break*/, 6];
                                return [4 /*yield*/, interaction.followUp({
                                        content: msg,
                                        fetchReply: false,
                                    })];
                            case 5:
                                _a.sent();
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, interaction.reply({
                                    content: msg,
                                    ephemeral: true,
                                    fetchReply: false,
                                })];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8: return [3 /*break*/, 10];
                            case 9:
                                e_2 = _a.sent();
                                log.error('something went wrong while running slash command', interaction.commandName);
                                log.error(e_2);
                                return [3 /*break*/, 10];
                            case 10: return [3 /*break*/, 11];
                            case 11:
                                log.info("finished running command /".concat(interaction.commandName, " from @").concat(interaction.user.username));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
