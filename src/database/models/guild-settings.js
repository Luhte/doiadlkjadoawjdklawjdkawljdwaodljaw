"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings = void 0;
var database_js_1 = require("../database.js");
var GuildSettings = function () {
    var _classDecorators = [database_js_1.orm.model()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = database_js_1.BaseModel;
    var _notifyRole_decorators;
    var _notifyRole_initializers = [];
    var _notifyRole_extraInitializers = [];
    var _notifyChannel_decorators;
    var _notifyChannel_initializers = [];
    var _notifyChannel_extraInitializers = [];
    var GuildSettings = _classThis = /** @class */ (function (_super) {
        __extends(GuildSettings_1, _super);
        function GuildSettings_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.notifyRole = __runInitializers(_this, _notifyRole_initializers, void 0);
            _this.notifyChannel = (__runInitializers(_this, _notifyRole_extraInitializers), __runInitializers(_this, _notifyChannel_initializers, void 0));
            __runInitializers(_this, _notifyChannel_extraInitializers);
            return _this;
        }
        return GuildSettings_1;
    }(_classSuper));
    __setFunctionName(_classThis, "GuildSettings");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _notifyRole_decorators = [database_js_1.orm.columnType('string')];
        _notifyChannel_decorators = [database_js_1.orm.columnType('string')];
        __esDecorate(null, null, _notifyRole_decorators, { kind: "field", name: "notifyRole", static: false, private: false, access: { has: function (obj) { return "notifyRole" in obj; }, get: function (obj) { return obj.notifyRole; }, set: function (obj, value) { obj.notifyRole = value; } }, metadata: _metadata }, _notifyRole_initializers, _notifyRole_extraInitializers);
        __esDecorate(null, null, _notifyChannel_decorators, { kind: "field", name: "notifyChannel", static: false, private: false, access: { has: function (obj) { return "notifyChannel" in obj; }, get: function (obj) { return obj.notifyChannel; }, set: function (obj, value) { obj.notifyChannel = value; } }, metadata: _metadata }, _notifyChannel_initializers, _notifyChannel_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GuildSettings = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GuildSettings = _classThis;
}();
exports.GuildSettings = GuildSettings;
