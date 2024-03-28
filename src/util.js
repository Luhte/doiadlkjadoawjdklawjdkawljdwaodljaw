"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.formatFileSize = void 0;
function formatFileSize(size) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'];
    var unit = 0;
    while (size > 1024) {
        size /= 1024;
        unit++;
        if (unit == units.length - 1)
            break;
    }
    return "".concat(size.toFixed(2), " ").concat(units[unit]);
}
exports.formatFileSize = formatFileSize;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
