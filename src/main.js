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
        while (_) try {
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
exports.__esModule = true;
exports.ButtonType = exports.ApplicationCommandOptionType = exports.Interaction = void 0;
// @ts-ignore
var node_fetch_1 = require("node-fetch");
var Interaction = /** @class */ (function () {
    function Interaction(data, bot_id, token) {
        var _this = this;
        this.bot_token = token;
        this.bot_id = bot_id;
        this.endpoints = {
            CALLBACK: "https://discord.com/api/v9/interactions/" + data.id + "/" + data.token + "/callback",
            MESSAGES: "https://discord.com/api/v9/webhooks/" + this.bot_id + "/" + data.token + "/messages/@original",
            FOLLOWUP: "https://discord.com/api/v9/webhooks/" + this.bot_id + "/" + data.token
        };
        if (data.type === 2) {
            // @ts-ignore
            this.packet = new SlashMessageInteraction(data);
        }
        else if (data.type === 3) {
            // @ts-ignore
            this.packet = new ButtonMessageInteraction(data);
        }
        this.followup = function (content, thread_id) {
            if (thread_id === void 0) { thread_id = null; }
            return new Promise(function (resolve, reject) {
                node_fetch_1["default"](_this.endpoints.FOLLOWUP, {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': "Bot " + _this.bot_token
                    }
                }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = resolve;
                                return [4 /*yield*/, verifyRes(res, 200)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        this.edit_followup = function (content, message_id) {
            return new Promise(function (resolve, reject) {
                node_fetch_1["default"](_this.endpoints.FOLLOWUP + '/messages/' + message_id, {
                    method: "PATCH",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': "Bot " + _this.bot_token
                    }
                }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        resolve(verifyRes(res, 200));
                        return [2 /*return*/];
                    });
                }); });
            });
        };
        this.delete_followup = function (message_id) {
            return new Promise(function (resolve, reject) {
                node_fetch_1["default"](_this.endpoints.FOLLOWUP + '/messages/' + message_id, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': "Bot " + _this.bot_token
                    }
                }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        resolve(verifyRes(res, 204));
                        return [2 /*return*/];
                    });
                }); });
            });
        };
        this.callback = function (content) {
            return new Promise(function (resolve) {
                node_fetch_1["default"](_this.endpoints.CALLBACK, {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        resolve(res || null);
                        return [2 /*return*/];
                    });
                }); })["catch"](function () { });
            });
        };
        this.defer = function () {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = resolve;
                            return [4 /*yield*/, this.callback({ type: 6 })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        this.thinking = function () {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = resolve;
                            return [4 /*yield*/, this.callback({ type: 5 })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        return this;
    }
    return Interaction;
}());
exports.Interaction = Interaction;
var SlashMessageInteraction = /** @class */ (function () {
    function SlashMessageInteraction(data) {
        return {
            version: data.version,
            type: data.type,
            member: data.member,
            user: data.member.user,
            interaction: {
                id: data.id,
                token: data.token,
                guild_id: data.guild_id,
                channel_id: data.channel_id
            },
            command: {
                id: data.data.id,
                options: data.data.options,
                name: data.data.name,
                guild_id: data.guild_id,
                channel_id: data.channel_id
            },
            timestamp: Date.now()
        };
    }
    return SlashMessageInteraction;
}());
var ButtonMessageInteraction = /** @class */ (function () {
    function ButtonMessageInteraction(data) {
        return {
            version: data.version,
            type: data.type,
            member: data.member,
            user: data.member.user,
            interaction: {
                id: data.id,
                token: data.token,
                guild_id: data.guild_id,
                channel_id: data.channel_id
            },
            message: data.message,
            command: {
                id: data.data.custom_id,
                type: data.data.component_type,
                values: data.data.values || [],
                guild_id: data.guild_id,
                channel_id: data.channel_id,
                _raw: data.data
            },
            timestamp: Date.now()
        };
    }
    return ButtonMessageInteraction;
}());
var verifyRes = function (res, expected_code) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1, e_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(res.status === expected_code)) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (res === null || res === void 0 ? void 0 : res.json())];
            case 2: return [2 /*return*/, (_b.sent()) || {}];
            case 3:
                e_1 = _b.sent();
                return [2 /*return*/, {}];
            case 4: return [3 /*break*/, 9];
            case 5:
                console.error("Warning Unexpected Status Code!");
                console.error(res.status);
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                _a = { status: res.status };
                return [4 /*yield*/, (res === null || res === void 0 ? void 0 : res.json())];
            case 7: return [2 /*return*/, (_a.body = (_b.sent()) || {}, _a)];
            case 8:
                e_2 = _b.sent();
                return [2 /*return*/, { status: res.status, body: {} }];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.ApplicationCommandOptionType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8
};
exports.ButtonType = {
    type: {
        ROW: 1,
        BUTTON: 2,
        MENU: 3
    },
    style: {
        PRIMARY: 1,
        SECONDARY: 2,
        SUCCESS: 3,
        DANGER: 4,
        LINK: 5
    }
};
