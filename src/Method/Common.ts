import { inject, injectable, container, DependencyContainer, Lifecycle } from "tsyringe";
import crypto from "crypto";
//import { https } from "https";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil"
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { VFS } from "@spt-aki/utils/VFS"
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
@injectable()
export class Common {

    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("PreAkiModLoader") protected preLoader: PreAkiModLoader,
        @inject("JsonUtil") protected json: JsonUtil,
        @inject("ImporterUtil") protected imports: ImporterUtil,
        @inject("VFS") protected vfs: VFS 

    ) { }
    public DB = this.databaseServer.getTables()
    public ModPath: String = this.preLoader.getModPath("MiniHUD-Reborn");
    public ModDB = this.imports.loadRecursive(`${this.ModPath}db/`)
    public Config = this.json.deserialize(this.vfs.readFile(`${this.ModPath}config.json`))
    public Pack = this.json.deserialize(this.vfs.readFile(`${this.ModPath}package.json`));
    public ModVersion = this.Pack.version
    public ModName = this.Pack.name
    public ModAuthor = this.Pack.author
    public Lv0 = this.Config.Main.Color.ColorLevel0
    public Lv1 = this.Config.Main.Color.ColorLevel1
    public Lv2 = this.Config.Main.Color.ColorLevel2
    public Lv3 = this.Config.Main.Color.ColorLevel3
    public Lv4 = this.Config.Main.Color.ColorLevel4
    public Lv5 = this.Config.Main.Color.ColorLevel5
    public Lv6 = this.Config.Main.Color.ColorLevel6
    public Lv7 = this.Config.Main.Color.ColorLevel7
    public Tag0 = this.Config.Main.Tag.TagLevel0
    public Tag1 = this.Config.Main.Tag.TagLevel1
    public Tag2 = this.Config.Main.Tag.TagLevel2
    public Tag3 = this.Config.Main.Tag.TagLevel3
    public Tag4 = this.Config.Main.Tag.TagLevel4
    public Tag5 = this.Config.Main.Tag.TagLevel5
    public Tag6 = this.Config.Main.Tag.TagLevel6
    public Tag7 = this.Config.Main.Tag.TagLevel7
    public price = this.Config.Main.Color.PriceColor
    public Log(string: String) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.WHITE)

    }
    public Notice(string: String) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.GREEN)

    }
    public Error(string: String) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.RED)

    }
    public Warn(string: String) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.YELLOW)

    }
    public Announce(string: String) {
        this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.CYAN)

    }
    public Debug(string: String) {
        if (this.Config.Main.DebugMode == true) {
            this.logger.logWithColor(`[MiniHUD]: ${string}`, LogTextColor.CYAN)
        }

    }
    public Hash(string: String) {
        const shasum = crypto.createHash("sha1");
        shasum.update(string);
        return shasum.digest("hex").substring(0, 24);
    }
    public formatTime(milliseconds: number): string {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        const millisecondsRemaining = ((milliseconds % 1000) / 1000).toFixed(2).substring(2);

        let result = "";

        if (hours > 0) {
            result += `${hours}小时`;
        }

        if (minutes > 0) {
            if(minutes >= 10){
                result += `${minutes}分`;
            }
            else{
                if(hours>0){
                result += `0${minutes}分`;
                }
                else{
                    result += `${minutes}分`;
                }
            }
        }
        if (seconds > 0) {
            if(seconds >= 10){
            result += `${seconds}.${millisecondsRemaining}秒`;
            }
            else{
                if(minutes>0){
                    result += `0${seconds}.${millisecondsRemaining}秒`;
                }
                else{
                    result += `${seconds}.${millisecondsRemaining}秒`;
                }
            }
        }
        if(!(seconds>0)){
        result += `0.${millisecondsRemaining}秒`;
        }

        return result.trim();
    }
    public countKeys(obj) {
        return Object.keys(obj).length;
    }
    public async checkUpdate(requesturl: string, downloadlink: string, githublink: string, giteelink: string): Promise<void> {
        try {
            const options = {
                rejectUnauthorized: false
            };

            const version = this.ModVersion
            const modname = this.ModName
            const timeout = 5000
            const http = require('https');
            const response = await new Promise((resolve, reject) => {
                http.get(requesturl, options, resolve).on('error', reject);
            });

            let result = '';
            this.Log("正在检查更新…")
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.on('end', () => {
                const responseVersion = result.trim().substring(0, 5);
                if (responseVersion !== version) {
                    //CustomLog(`Current version: ${currentVersion}. New version: ${responseVersion}. Mod Name: ${ModName}`);
                    this.Notice(`发现可用的新版本！`);
                    this.Log(`当前版本：${version}  最新版本：${responseVersion}`);
                    this.Announce(`可从此链接下载新版本: ${downloadlink}`);
                    this.Warn(`警告：你正在使用已经过期的版本！`);
                } else {
                    //CustomLog(`Current version (${currentVersion}) is up-to-date. Mod Name: ${ModName}`);
                    this.Log(`当前版本已是最新。`);
                    this.Log(`你正在使用最新版本(${version})`);
                }
                if (result) {
                } else {
                }
                if(githublink!=null){
                this.Announce(`在GitHub上查看此项目: ${githublink}`);
                }
                else{
                    this.Announce(`在GitHub上查看此项目: 暂无链接`);
                }
                if(githublink!=null){
                    this.Announce(`在Gitee上查看此项目: ${giteelink}`);
                }
                else{
                    this.Announce(`在Gitee上查看此项目: 暂无链接`);
                }
            });
            response.setTimeout(timeout, () => {
                this.Error(`错误: 请求超时(${timeout}毫秒)`);
                response.abort();
            });
        } catch (error) {
            this.Error(`错误: 请求失败！错误信息: ${error.message}`);
        }
    }
    public async getAnnouncement(requesturl: string): Promise<void> {
        try {
            const options = {
                rejectUnauthorized: false
            };
            const http = require('https');
            const response = await new Promise((resolve, reject) => {
                http.get(requesturl, options, resolve).on('error', reject);
            });

            let result = '';
            this.Announce("正在获取公告…")
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.on('end', () => {
                this.Announce(`公告: ${result}`);
            });
        } catch (error) {
            this.Log(error);
        }
    }
    public async getUpdateLog(requesturl: string): Promise<void> {
        try {
            const options = {
                rejectUnauthorized: false
            };
            const http = require('https');
            const response = await new Promise((resolve, reject) => {
                http.get(requesturl, options, resolve).on('error', reject);
            });

            let result = '';
            this.Announce("正在获取更新日志…")
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.on('end', () => {
                this.Announce(`更新日志: ${result}`);
            });
        } catch (error) {
            this.Log(error);
        }
    }
    public checkTrader(traderid){
        if(this.DB.traders[traderid]!=null){
            return true
        }
        else{
            return false
        }
    }
}