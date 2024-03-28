"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var discord_js_1 = require("discord.js");
var events_js_1 = require("./core/events.js");
var log_js_1 = require("./log.js");
log_js_1.Log.rotate();
var log = (0, log_js_1.create)('main');
log.info('starting up...');
var command_handler_js_1 = require("./core/command-handler.js");
var database_js_1 = require("./database/database.js");
require("./core/notifier.js");
var path_1 = require("path");
await (0, database_js_1.loadModels)(path_1.default.join(path_1.default.dirname(new URL(import.meta.url).pathname), 'database', 'models'));
await (0, command_handler_js_1.loadCommands)(path_1.default.join(path_1.default.dirname(new URL(import.meta.url).pathname), 'commands'));
var client = new discord_js_1.default.Client({
    intents: ['Guilds'],
});
client.on('ready', function (client) {
    log.info("logged in as @".concat(client.user.username));
    log.info('ready to accept & run commands');
    events_js_1.default.emit('botReady', client);
});
log.info('logging in...');
await client.login(process.env.DISCORD_TOKEN);
