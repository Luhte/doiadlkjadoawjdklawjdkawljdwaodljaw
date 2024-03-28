"use strict";
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
exports.create = exports.Log = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var chalk_1 = require("chalk");
var Levels = ['info', 'warn', 'error', 'critical', 'debug'];
var Log = /** @class */ (function () {
    function Log(loggerName) {
        this.loggerName = loggerName;
    }
    Log.rotate = function () {
        var _this = this;
        if (!fs_1.default.existsSync('log'))
            fs_1.default.mkdirSync('log');
        var crashPath = (0, path_1.join)('log', 'crashes');
        if (!fs_1.default.existsSync(crashPath))
            fs_1.default.mkdirSync(crashPath);
        if (fs_1.default.existsSync((0, path_1.join)('log', 'verbose.txt'))) {
            fs_1.default.unlinkSync((0, path_1.join)('log', 'verbose.txt'));
        }
        var files = __spreadArray([], fs_1.default.readdirSync('log'), true).filter(function (d) { return d.startsWith('log.txt'); })
            .sort(function (fileA, fileB) {
            var a = parseInt(fileA.slice('log.txt.'.length));
            var b = parseInt(fileB.slice('log.txt.'.length));
            if (fileA === 'log.txt')
                a = 0;
            if (fileB === 'log.txt')
                b = 0;
            return b - a;
        });
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var index = file === 'log.txt' ? 0 : parseInt(file.slice('log.txt.'.length));
            if (index + 1 > 5) {
                fs_1.default.unlinkSync((0, path_1.join)('log', file));
            }
            else {
                fs_1.default.renameSync((0, path_1.join)('log', file), (0, path_1.join)('log', "log.txt.".concat(index + 1)));
            }
        }
        this.rotated = true;
        this.writeQueue.forEach(function (_a) {
            var msg = _a.msg, verboseOnly = _a.verboseOnly;
            _this.write(msg, verboseOnly);
        });
    };
    Log.createCrash = function () {
        var crashPath = (0, path_1.join)('log', 'crashes');
        if (!fs_1.default.existsSync(crashPath))
            fs_1.default.mkdirSync(crashPath);
        var crashTime = new Date().toISOString();
        fs_1.default.copyFileSync((0, path_1.join)('log', 'log.txt'), (0, path_1.join)(crashPath, "".concat(crashTime, ".txt")));
        fs_1.default.copyFileSync((0, path_1.join)('log', 'verbose.txt'), (0, path_1.join)(crashPath, "".concat(crashTime, ".verbose.txt")));
    };
    Log.getMsg = function (level, data) {
        var msg = [];
        if (!Array.isArray(data))
            data = [data];
        if (data.length === 0)
            return this.getMsg(level, '');
        for (var _i = 0, _a = data; _i < _a.length; _i++) {
            var datum = _a[_i];
            if (datum instanceof Error) {
                msg.push(datum.stack);
                if (datum.cause != null) {
                    msg.push(datum.cause instanceof Error ? datum.cause.stack : JSON.stringify(datum, null, 2));
                }
            }
            else if (datum instanceof Object) {
                msg.push(JSON.stringify(datum, null, 2));
            }
            else {
                msg.push(datum);
            }
        }
        switch (level) {
            case 'info': {
                return "".concat(chalk_1.default.green("[ ".concat(new Date()
                    .toISOString()
                    .replace(/T|(\.[0-9]*)Z/g, ' ')
                    .trim(), " ]")), " ").concat(chalk_1.default.green.bold('[I]'), " ").concat(chalk_1.default.green(msg.join(' ')));
            }
            case 'warn': {
                return "".concat(chalk_1.default.yellow("[ ".concat(new Date()
                    .toISOString()
                    .replace(/T|(\.[0-9]*)Z/g, ' ')
                    .trim(), " ]")), " ").concat(chalk_1.default.yellow.bold('[W]'), " ").concat(chalk_1.default.yellow(msg.join(' ')));
            }
            case 'error': {
                return "".concat(chalk_1.default.red("[ ".concat(new Date()
                    .toISOString()
                    .replace(/T|(\.[0-9]*)Z/g, ' ')
                    .trim(), " ]")), " ").concat(chalk_1.default.red.bold('[E]'), " ").concat(chalk_1.default.red(msg.join(' ')));
            }
            case 'critical': {
                return "".concat(chalk_1.default.redBright("[ ".concat(new Date()
                    .toISOString()
                    .replace(/T|(\.[0-9]*)Z/g, ' ')
                    .trim(), " ]")), " ").concat(chalk_1.default.redBright.bold('[C]'), " ").concat(chalk_1.default.redBright(msg.join(' ')));
            }
            case 'debug': {
                return "".concat(chalk_1.default.blue("[ ".concat(new Date()
                    .toISOString()
                    .replace(/T|(\.[0-9]*)Z/g, ' ')
                    .trim(), " ]")), " ").concat(chalk_1.default.blue.bold('[D]'), " ").concat(chalk_1.default.blue(msg.join(' ')));
            }
        }
    };
    Log.write = function (msg, verboseOnly) {
        if (verboseOnly === void 0) { verboseOnly = false; }
        if (this.rotated) {
            fs_1.default.appendFileSync((0, path_1.join)('log', 'verbose.txt'), msg.trim() + '\n');
            if (verboseOnly)
                return;
            fs_1.default.appendFileSync((0, path_1.join)('log', 'log.txt'), msg.trim() + '\n');
        }
        else {
            this.writeQueue.push({ msg: msg, verboseOnly: verboseOnly });
        }
    };
    Log.info = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var msg = this.getMsg('info', data);
        console.log(msg);
        this.write(msg);
    };
    Log.warn = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var msg = this.getMsg('warn', data);
        console.warn(msg);
        this.write(msg);
    };
    Log.error = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var msg = this.getMsg('error', data);
        console.error(msg);
        this.write(msg);
    };
    Log.critical = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var msg = this.getMsg('critical', data);
        console.error(msg);
        this.write(msg);
    };
    Log.debug = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var msg = this.getMsg('debug', data);
        this.write(msg, true);
        if (process.env.VERBOSE_LOGGING)
            console.debug(msg);
    };
    // public static logMethod(level: (typeof Levels)[number], tag: string) {
    //     return (target: unknown, key: string, descriptor: unknown) => {
    //         const originalMethod = descriptor.value;
    //         descriptor.value = function (...args: unknown[]) {
    //             Log[level](
    //                 `[method-logger] [${tag}] called ${
    //                     target.constructor.name === 'Function' ? target.name : target.constructor.name
    //                 }.${key}(${args.join(', ')})`
    //             );
    //             return originalMethod.apply(target, args);
    //         };
    //         return descriptor;
    //     };
    // }
    Log.prototype.info = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        Log.info.apply(Log, __spreadArray([this.name], data, false));
    };
    Log.prototype.warn = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        Log.warn.apply(Log, __spreadArray([this.name], data, false));
    };
    Log.prototype.error = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        Log.error.apply(Log, __spreadArray([this.name], data, false));
    };
    Log.prototype.critical = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        Log.critical.apply(Log, __spreadArray([this.name], data, false));
    };
    Log.prototype.debug = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        Log.debug.apply(Log, __spreadArray([this.name], data, false));
    };
    Object.defineProperty(Log.prototype, "name", {
        get: function () {
            return "[".concat(this.loggerName, "]");
        },
        enumerable: false,
        configurable: true
    });
    Log.writeQueue = [];
    Log.rotated = false;
    return Log;
}());
exports.Log = Log;
function create(name) {
    return new Log(name);
}
exports.create = create;
exports.default = Log;
process.on('uncaughtException', function (e) {
    Log.critical('=== Unhandled Exception ===');
    Log.critical(e);
    Log.createCrash();
    process.exit(1);
});
process.on('unhandledRejection', function (e) {
    Log.critical('=== Unhandled Rejection ===');
    Log.critical(e);
    Log.createCrash();
    process.exit(1);
});
