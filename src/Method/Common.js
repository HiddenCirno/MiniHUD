"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const crypto_1 = __importDefault(require("crypto"));
//import { https } from "https";
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ImporterUtil_1 = require("C:/snapshot/project/obj/utils/ImporterUtil");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("C:/snapshot/project/obj/utils/VFS");
const PreAkiModLoader_1 = require("C:/snapshot/project/obj/loaders/PreAkiModLoader");
let Common = class Common {
    constructor(logger, databaseServer, preLoader, json, imports, vfs) {
        this.logger = logger;
        this.databaseServer = databaseServer;
        this.preLoader = preLoader;
        this.json = json;
        this.imports = imports;
        this.vfs = vfs;
        this.DB = this.databaseServer.getTables();
        this.ModPath = this.preLoader.getModPath("MiniHUD-Reborn");
        this.ModDB = this.imports.loadRecursive(`${this.ModPath}db/`);
        this.Config = this.json.deserialize(this.vfs.readFile(`${this.ModPath}config.json`));
        this.Pack = this.json.deserialize(this.vfs.readFile(`${this.ModPath}package.json`));
        this.ModVersion = this.Pack.version;
        this.ModName = this.Pack.name;
        this.ModAuthor = this.Pack.author;
        this.Lv0 = this.Config.Main.Color.ColorLevel0;
        this.Lv1 = this.Config.Main.Color.ColorLevel1;
        this.Lv2 = this.Config.Main.Color.ColorLevel2;
        this.Lv3 = this.Config.Main.Color.ColorLevel3;
        this.Lv4 = this.Config.Main.Color.ColorLevel4;
        this.Lv5 = this.Config.Main.Color.ColorLevel5;
        this.Lv6 = this.Config.Main.Color.ColorLevel6;
        this.Lv7 = this.Config.Main.Color.ColorLevel7;
        this.Tag0 = this.Config.Main.Tag.TagLevel0;
        this.Tag1 = this.Config.Main.Tag.TagLevel1;
        this.Tag2 = this.Config.Main.Tag.TagLevel2;
        this.Tag3 = this.Config.Main.Tag.TagLevel3;
        this.Tag4 = this.Config.Main.Tag.TagLevel4;
        this.Tag5 = this.Config.Main.Tag.TagLevel5;
        this.Tag6 = this.Config.Main.Tag.TagLevel6;
        this.Tag7 = this.Config.Main.Tag.TagLevel7;
        this.price = this.Config.Main.Color.PriceColor;
    }
    Log(string) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.WHITE);
    }
    Notice(string) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.GREEN);
    }
    Error(string) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.RED);
    }
    Warn(string) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.YELLOW);
    }
    Announce(string) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.CYAN);
    }
    Debug(string) {
        if (this.Config.Main.DebugMode == true) {
            this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor_1.LogTextColor.CYAN);
        }
    }
    Hash(string) {
        const shasum = crypto_1.default.createHash("sha1");
        shasum.update(string);
        return shasum.digest("hex").substring(0, 24);
    }
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        const millisecondsRemaining = ((milliseconds % 1000) / 1000).toFixed(2).substring(2);
        let result = "";
        if (hours > 0) {
            result += `${hours}小时`;
        }
        if (minutes > 0) {
            if (hours > 0) {
                result += `0${minutes}分`;
            }
            else {
                result += `${minutes}分`;
            }
        }
        if (seconds > 0) {
            if (minutes > 0) {
                result += `0${seconds}.${millisecondsRemaining}秒`;
            }
            else {
                result += `${seconds}.${millisecondsRemaining}秒`;
            }
        }
        if (!(seconds > 0)) {
            result += `0.${millisecondsRemaining}秒`;
        }
        return result.trim();
    }
    countKeys(obj) {
        return Object.keys(obj).length;
    }
    async checkUpdate(requesturl, downloadlink, githublink, giteelink) {
        try {
            const options = {
                rejectUnauthorized: false
            };
            const version = this.ModVersion;
            const modname = this.ModName;
            const timeout = 5000;
            const http = require('https');
            const response = await new Promise((resolve, reject) => {
                http.get(requesturl, options, resolve).on('error', reject);
            });
            let result = '';
            this.Log("正在检查更新…");
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.on('end', () => {
                const responseVersion = result.trim();
                if (responseVersion !== version) {
                    //CustomLog(`Current version: ${currentVersion}. New version: ${responseVersion}. Mod Name: ${ModName}`);
                    this.Notice(`发现可用的新版本！`);
                    this.Log(`当前版本：${version}  最新版本：${responseVersion}`);
                    this.Announce(`可从此链接下载新版本: ${downloadlink}`);
                    this.Warn(`警告：你正在使用已经过期的版本！`);
                }
                else {
                    //CustomLog(`Current version (${currentVersion}) is up-to-date. Mod Name: ${ModName}`);
                    this.Log(`当前版本已是最新。`);
                    this.Log(`你正在使用最新版本(${version})。`);
                }
                if (result) {
                }
                else {
                }
                if (githublink != null) {
                    this.Announce(`在GitHub上查看此项目: ${githublink}`);
                }
                else {
                    this.Announce(`在GitHub上查看此项目: 暂无链接`);
                }
                if (githublink != null) {
                    this.Announce(`在Gitee上查看此项目: ${giteelink}`);
                }
                else {
                    this.Announce(`在Gitee上查看此项目: 暂无链接`);
                }
            });
            response.setTimeout(timeout, () => {
                this.Error(`错误: 请求超时(${timeout}毫秒)`);
                response.abort();
            });
        }
        catch (error) {
            this.Error(`错误: 请求失败！错误信息: ${error.message}`);
        }
    }
    async getAnnouncement(requesturl) {
        try {
            const options = {
                rejectUnauthorized: false
            };
            const http = require('https');
            const response = await new Promise((resolve, reject) => {
                http.get(requesturl, options, resolve).on('error', reject);
            });
            let result = '';
            this.Announce("正在获取公告…");
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.on('end', () => {
                this.Announce(`公告: ${result}`);
            });
        }
        catch (error) {
            this.Log(error);
        }
    }
};
Common = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(2, (0, tsyringe_1.inject)("PreAkiModLoader")),
    __param(3, (0, tsyringe_1.inject)("JsonUtil")),
    __param(4, (0, tsyringe_1.inject)("ImporterUtil")),
    __param(5, (0, tsyringe_1.inject)("VFS")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _b : Object, typeof (_c = typeof PreAkiModLoader_1.PreAkiModLoader !== "undefined" && PreAkiModLoader_1.PreAkiModLoader) === "function" ? _c : Object, typeof (_d = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _d : Object, typeof (_e = typeof ImporterUtil_1.ImporterUtil !== "undefined" && ImporterUtil_1.ImporterUtil) === "function" ? _e : Object, typeof (_f = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _f : Object])
], Common);
exports.Common = Common;
