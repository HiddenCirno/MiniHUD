import { DependencyContainer } from "tsyringe";
import crypto from "crypto";
import process from "process";
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { DynamicRouterModService } from "@spt-aki/services/mod/dynamicRouter/DynamicRouterModService";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import type { LauncherController } from "@spt-aki/controllers/LauncherController";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { RagfairController } from "@spt-aki/controllers/RagfairController";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { VFS } from "@spt-aki/utils/VFS"
import { RagfairSort } from "@spt-aki/models/enums/RagfairSort"
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil"
import { RagfairSortHelper } from "@spt-aki/helpers/RagfairSortHelper";
import { IGetItemPriceResult } from "@spt-aki/models/eft/ragfair/IGetItemPriceResult";
import { IGetMarketPriceRequestData } from "@spt-aki/models/eft/ragfair/IGetMarketPriceRequestData";
class Mod implements IPreAkiLoadMod {
    // Code added here will load BEFORE the server has started loadin
    private static container: DependencyContainer;
    public preAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const dynamicRouterModService = container.resolve<DynamicRouterModService>("DynamicRouterModService");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const LauncherController = container.resolve<LauncherController>("LauncherController");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const ragfairController = container.resolve("RagfairController");
        Mod.container = container;
        staticRouterModService.registerStaticRouter(
            "StaticRoutePeekingAkiHudLoad",
            [
                {
                    url: "/launcher/profile/compatibleTarkovVersion",
                    action: (url, info, sessionId, output) => {
                        //var saveversion = profileHelper.getFullProfile(sessionId).info.edition
                        //logger.info("Hook Awaked.")
                        this.MyMethodForGame(container, sessionId)
                        return output;
                    }
                }
            ],
            "aki"
        );
        //ragfairController.getItemMinAvgMaxFleaPriceValues = this.getItemMinAvgMaxFleaPriceValues
        container.afterResolution("RagfairController", (_t, result: RagfairController) => {
            // We want to replace the original method logic with something different
            result.getItemMinAvgMaxFleaPriceValues = (getPriceRequest: IGetMarketPriceRequestData) => {
                return this.getItemMinAvgMaxFleaPriceValues(getPriceRequest);
            }
            // The modifier Always makes sure this replacement method is ALWAYS replaced
        }, { frequency: "Always" });
        //container.register<ReWriteRagfairController>("ReWriteRagfairController", ReWriteRagfairController);
        //container.register("RagfairController", {useToken: "ReWriteRagfairController"});
    }
    public tr: Boolean = false
    public hs: String = ""
    public postAkiLoad(container: DependencyContainer): void {
    }
    public postDBLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("MiniHUD")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const Config = JsonUtil.deserialize(VFS.readFile(`${ModPath}config.json`));
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const Locale = ClientDB.locales.global["ch"]
        const ELocale = ClientDB.locales.global["en"]
        //名称重设
        if (Config.ResetName == true) {
            ClientDB.bots.types.bear.firstName = Name.Bear
            ClientDB.bots.types.pmcbot.firstName = Name.Bear
            //ClientDB.bots.types.marksman.firstName = Name.Bear
            ClientDB.bots.types.usec.firstName = Name.Usec
        }
        //PMC聊天
        for (let mes in DB.PMCtext) {
            //CustomLog(Locale[mes])
            //Locale[mes] = DB.PMCtext[mes]
            ELocale[mes] = DB.PMCtext[mes]
            //CustomLog(Locale[mes])
        }                                          
        CustomLog("        #          W          ,:        +  *           ")
        CustomLog(" ..:WWWWW   .  ,   W          WW        W  W           ")
        CustomLog(" WWW.W      WWWW   W    WWWW* WWW    WWWWWWWWWW        ")
        CustomLog("     W      W  W   W      W  W# W#      W  W           ")
        CustomLog("     W      W  WWWWWWWW   W WWW* WW     W WW           ")
        CustomLog("WWWWWWWWWW: W  W   W    WWWWW  W  W    #W *: WW        ")
        CustomLog("     W      W  W   W      W  ****#    @W  *:W.      ")
        CustomLog("     W      W**W   W      W  ....W   WWW  *W,        ")
        CustomLog("     W      W..W   W      W@W   W    W W,WW:           ")
        CustomLog("     W      *      W    @WW+ ,WW+      W +*:  #W       ")
        CustomLog("     W             W    *      W+      W  +WWWW        ")
        CustomLog("    .W             W            W      W    ..        ")
        CustomLog("MiniHUD拥有GitHub页面和公开下载连接，请勿从淘宝等其他渠道获取本Mod。")
        ClientDB.templates.items["MiniHUDCacheItem"] = DB["MiniHUDCacheItem"]
        var ItemData = DB["MiniHUDCacheItem"]
        Locale[ItemData._id + " Name"] = ItemData._props.Name
        Locale[ItemData._id + " ShortName"] = ItemData._props.ShortName
        Locale[ItemData._id + " Description"] = ItemData._props.Description
        ClientDB.templates.handbook.Items.push({
            "Id": ItemData._id,
            "ParentId": ItemData._props.RagfairType,
            "Price": ItemData._props.DefaultPrice
        })
        VFS.writeFile(`${ModPath}Cache.json`, JSON.stringify({ ReWriteCache: true }, null, 4))
        const Pack = JsonUtil.deserialize(VFS.readFile(`${ModPath}package.json`));
        const version = Pack.version
        const ModName = Pack.name
        const fs = require('fs');
        const checkUpdate = (url) => {
            const timeout = 5000;
            const currentVersion = version;

            return new Promise((resolve, reject) => {
                const req = http.request(url, (res) => {
                    let data = '';
                    //CustomLog("Checking update for mod " + ModName + "....")
                    CustomLog("模组" + ModName + "正在检查更新…")
                    //CustomLog(data)
                    res.on('data', (chunk) => {
                        //console.log(`BODY: ${chunk}`);
                        data += chunk;
                    });

                    res.on('end', () => {
                        const responseVersion = data.trim();
                        //CustomLog(data)
                        if (responseVersion !== currentVersion) {
                            //CustomLog(`Current version: ${currentVersion}. New version: ${responseVersion}. Mod Name: ${ModName}`);
                            CustomLog(`当前版本：${currentVersion}. 最新版本：${responseVersion}. 模组名称：${ModName}`);
                            resolve({ currentVersion, responseVersion });
                        } else {
                            //CustomLog(`Current version (${currentVersion}) is up-to-date. Mod Name: ${ModName}`);
                            CustomLog(`当前版本（${currentVersion}）已是最新。模组名称：${ModName}`);
                            resolve(null);
                        }
                    });
                });

                req.on('error', (error) => {
                    CustomDenied(`Request failed: ${error.message}`);
                    reject(error);
                });

                req.setTimeout(timeout, () => {
                    CustomDenied(`Request timed out after ${timeout} milliseconds.`);
                    req.abort();
                    reject(`Request timed out after ${timeout} milliseconds.`);
                });

                req.end();
            });
        };
        const rd = require('readline');
        const rl = rd.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.tr = false
        const fp = `${ModPath}src/mod.ts`;
        const h1 = crypto.createHash('sha256');
        const stream = fs.createReadStream(fp);
        const http = require('https');
        const fileUrl = 'https://gitee.com/HiddenCirno/version-check/raw/master/%E9%BA%A6%E6%88%88%E6%8B%89%E8%B6%85%E4%BA%91%E7%AB%AF/MiniHUD/Hash.txt';
        const announcement = 'https://gitee.com/HiddenCirno/version-check/raw/master/%E9%BA%A6%E6%88%88%E6%8B%89%E8%B6%85%E4%BA%91%E7%AB%AF/MiniHUD/Announcement.txt';
        http.get(fileUrl, (r) => {
            let fd = '';

            r.on('data', (c) => {
                fd += c;
            });

            r.on('end', () => {
                this.hs = fd
            });
        }).on('error', (e) => {
            CustomDenied(`警告，无法访问麦戈拉超云端: ${e.message}`);
            //process.exit()
        });
        http.get(announcement, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                CustomAccess(`[MiniHUD]: 更新公告：${data}`)
            });
        }).on('error', (err) => {
            CustomDenied(`[MiniHUD]: 更新公告请求失败，请检查网络连接: ${err.message}`);
        });
        var h = ""
        stream.on('data', function (data) {
            h1.update(data);
        });
        stream.on('end', function () {
            const fh = h1.digest('hex');
            h = fh
            VFS.writeFile(`${ModPath}HashKey.txt`, JSON.stringify(h, null, 4))
        });
        checkUpdate('https://gitee.com/HiddenCirno/version-check/raw/master/MiniHudVersionCheck.txt')
            .then((result) => {
                if (result) {
                    //CustomAccess(`There is a new version available! Mod Name: ${ModName}`);
                    CustomAccess(`发现可用的新版本！模组名称：${ModName}`);
                    CustomAccess(`可从此链接下载新版本： https://pan.baidu.com/s/1Ob8gUz8V4gWXQFpeJzQTpw?pwd=MHWI `);
                    //CustomDenied(`Warning: You are using a outdated version! Mod Name: ${ModName}`);
                    CustomDenied(`警告：你正在使用已经过期的版本！模组名称：${ModName}`);
                } else {
                    //CustomLog(`You are using the latest version. Mod Name: ${ModName}`);
                    CustomLog(`你正在使用最新版本。模组名称：${ModName}`);
                }
                //CustomLog("View the code on github: NoLinkHere.")
                CustomLog("在GitHub上查看此项目： https://github.com/HiddenCirno/MiniHUD ")
            })
            .catch((error) => {
                CustomDenied(error);
            });
        function CustomLog(string) {
            Logger.logWithColor("[Console]: " + string, "cyan");
        }
        function CustomAccess(string) {
            Logger.logWithColor("[Console]: " + string, "green");
        }
        function CustomDenied(string) {
            Logger.logWithColor("[Console]: " + string, "red");
        }
    }
    public MyMethodForGame(container: DependencyContainer, sessionId: String): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const VFS = container.resolve<VFS>("VFS");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("MiniHUD")
        const ragfairController = container.resolve("RagfairController");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const Config = JsonUtil.deserialize(VFS.readFile(`${ModPath}config.json`));
        const DebugConfig = JsonUtil.deserialize(VFS.readFile(`${ModPath}debugconfig.json`));
        const MiscConfig = JsonUtil.deserialize(VFS.readFile(`${ModPath}miscconfig.json`));
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const Cache = JsonUtil.deserialize(VFS.readFile(`${ModPath}Cache.json`));
        const ClientItems = ClientDB.templates.items
        const ClientQuest = ClientDB.templates.quests
        //const ky = JsonUtil.deserialize();
        const kyf = VFS.readFile(`${ModPath}HashKey.txt`)
        const Locale = ClientDB.locales.global["ch"]
        const ELocale = ClientDB.locales.global["en"]
        const Pack = JsonUtil.deserialize(VFS.readFile(`${ModPath}package.json`));
        const version = Pack.version
        const ModName = Pack.name
        const ModAuthor = Pack.author
        this.tr = false
        var Garbage = MiscConfig["废品"]//废品
        var Normal = MiscConfig["普通"]//普通
        var Excellent = MiscConfig["精良"]//精良
        var Rare = MiscConfig["稀有"]//稀有
        var Epic = MiscConfig["史诗"]//史诗
        var Legend = MiscConfig["传奇"]//传奇
        var God = MiscConfig["神话"]//神话
        var EX = MiscConfig["超越"]//超越
        var Price = ClientDB.templates.handbook.Items
        var Local = ClientDB.locales.global["ch"]
        var Area = ClientDB.hideout.areas
        var save = profileHelper.getFullProfile(sessionId)
        var Hideout = save.characters.pmc.Hideout.Areas
        var firstlogin = { trigger: true }
        //if (kyf === this.hs) this.tr = true
        //else this.tr = false
        HUDLog("数据加载中...")
        if (kyf === this.hs) {
            this.tr = true
        }
        else {
            if (this.hs == "") {
                CustomDenied(`无法连接到麦戈拉超云端，验证请求失败，请检查你的网络连接。`)
            }
            else {
                CustomDenied(`麦戈拉超云端验证失败，你正在使用的版本可能经过非法修改，${ModName}拒绝启动，请访问更新链接。`)
                CustomDenied(`更新链接： https://pan.baidu.com/s/1Ob8gUz8V4gWXQFpeJzQTpw?pwd=MHWI `)
            }
            this.tr = false
        }
        if (Cache.ReWriteCache == true && this.tr == true) {
            CustomAccess(`麦戈拉超云端验证通过，欢迎使用${ModName}`)
            CustomAccess(`当前版本：${version}，身份认证：${ModAuthor}`)
            //无数据任务清除、修复
            for (let quest in ClientDB.templates.quests) {
                var QuestID = ClientDB.templates.quests[quest]._id
                var Start = ClientDB.templates.quests[quest].conditions.AvailableForStart
                if (Start.length > 0) {
                    for (var i = 0; i < Start.length; i++) {
                        if (Start[i]._parent == "Quest") {
                            if (ClientDB.templates.quests[Start[i]._props.target] == undefined) {
                                Start.splice(i, 1)
                            }
                        }
                    }
                }
            }
            var ErrIDArr = []
            //初始化价格参考对象
            var PriceObj = {}
            var templateIdTemp = {}
            for (var i = 0; i < Price.length; i++) {
                PriceObj[Price[i].Id] = {}
                PriceObj[Price[i].Id]._id = Price[i].Id
                PriceObj[Price[i].Id].name = Locale[Price[i].Id + " Name"]
                PriceObj[Price[i].Id].price = Price[i].Price
                if (Config.RagfairPrice == true) {
                    templateIdTemp["templateId"] = Price[i].Id;
                    if (ClientItems[PriceObj[Price[i].Id]._id]._props.CanSellOnRagfair == true) {
                        PriceObj[Price[i].Id].price = Math.floor(ragfairController.getItemMinAvgMaxFleaPriceValues(templateIdTemp).avg);
                    }
                }
            }
            //初始化物品本地化文本缓存
            var LocaleObj = {}
            for (let item in ClientItems) {
                LocaleObj[item] = {}
                LocaleObj[item].Name = Locale[ClientItems[item]._id + " Name"]
                LocaleObj[item].ShortName = Locale[ClientItems[item]._id + " ShortName"]
                LocaleObj[item].Description = Locale[ClientItems[item]._id + " Description"]
            }
            //初始化任务名和介绍本地化文本
            var QLocaleObj = {}
            for (let quest in ClientQuest) {
                var QID = ClientQuest[quest]._id
                QLocaleObj[QID] = {}
                QLocaleObj[QID].Name = Locale[QID + " name"]
                QLocaleObj[QID].Description = Locale[QID + " description"]
            }
            //初始化任务数据缓存
            var QuestObj = {}
            //初始化任务对象和基础信息
            for (let quest in ClientQuest) {
                var QuestID = ClientQuest[quest]._id
                var StartArr = ClientQuest[quest].conditions.AvailableForStart
                var FinishArr = ClientQuest[quest].conditions.AvailableForFinish
                QuestObj[ClientQuest[quest]._id] = {}
                QuestObj[ClientQuest[quest]._id]._id = ClientQuest[quest]._id
                QuestObj[ClientQuest[quest]._id].name = Locale[ClientQuest[quest]._id + " name"]
                QuestObj[ClientQuest[quest]._id].description = Locale[ClientQuest[quest]._id + " description"]
                QuestObj[ClientQuest[quest]._id].traderid = ClientQuest[quest].traderId
                QuestObj[ClientQuest[quest]._id].tradername = Locale[ClientQuest[quest].traderId + " Nickname"]
                QuestObj[ClientQuest[quest]._id].conditions = {}
                QuestObj[ClientQuest[quest]._id].conditions.Prequest = {}
                QuestObj[ClientQuest[quest]._id].conditions.Level = {}
                QuestObj[ClientQuest[quest]._id].conditions.Loyalty = {}
                QuestObj[ClientQuest[quest]._id].conditions.Items = {}
                QuestObj[ClientQuest[quest]._id].conditions.Assembly = {}
                QuestObj[ClientQuest[quest]._id].conditions.Unlock = {}
            }
            //任务数据抽象处理、重构
            for (let quest in ClientQuest) {
                var StartArr = ClientQuest[quest].conditions.AvailableForStart
                var FinishArr = ClientQuest[quest].conditions.AvailableForFinish
                var QuestID = ClientDB.templates.quests[quest]._id
                if (StartArr.length > 0) {
                    for (var i = 0; i < StartArr.length; i++) {
                        switch (StartArr[i]._parent) {
                            //处理任务信息
                            case "Quest": {
                                try {
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target] = {}
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target]._id = StartArr[i]._props.target
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target].name = Locale[StartArr[i]._props.target + " name"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target].traderid = ClientQuest[StartArr[i]._props.target].traderId
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target].tradername = Locale[ClientQuest[StartArr[i]._props.target].traderId + " Nickname"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Prequest[StartArr[i]._props.target].status = StartArr[i]._props.status[0]
                                    QuestObj[StartArr[i]._props.target].conditions.Unlock[QuestID] = {}
                                    QuestObj[StartArr[i]._props.target].conditions.Unlock[QuestID]._id = ClientQuest[QuestID]._id
                                    QuestObj[StartArr[i]._props.target].conditions.Unlock[QuestID].name = Locale[ClientQuest[QuestID]._id + " name"]
                                    QuestObj[StartArr[i]._props.target].conditions.Unlock[QuestID].traderid = ClientQuest[QuestID].traderId
                                    QuestObj[StartArr[i]._props.target].conditions.Unlock[QuestID].tradername = Locale[ClientQuest[QuestID].traderId + " Nickname"]
                                }
                                catch (err) {
                                    CustomLog(err.message)
                                    CustomLog("QuestName: " + Locale[ClientQuest[quest]._id + " name"])
                                    CustomLog("QuestID: " + ClientQuest[quest]._id)
                                    CustomLog("ConditionType: Quest")
                                }
                            };
                                break;
                            //处理商人信任度信息
                            case "TraderLoyalty": {
                                try {
                                    QuestObj[ClientQuest[quest]._id].conditions.Loyalty[StartArr[i]._props.target] = {}
                                    QuestObj[ClientQuest[quest]._id].conditions.Loyalty[StartArr[i]._props.target]._id = StartArr[i]._props.target
                                    QuestObj[ClientQuest[quest]._id].conditions.Loyalty[StartArr[i]._props.target].name = Locale[StartArr[i]._props.target + " Nickname"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Loyalty[StartArr[i]._props.target].require = StartArr[i]._props.compareMethod
                                    QuestObj[ClientQuest[quest]._id].conditions.Loyalty[StartArr[i]._props.target].value = StartArr[i]._props.value
                                }
                                catch (err) {
                                    CustomLog(err.message)
                                    CustomLog("QuestName: " + Locale[ClientQuest[quest]._id + " name"])
                                    CustomLog("QuestID: " + ClientQuest[quest]._id)
                                    CustomLog("ConditionType: TraderLoyalty")
                                }
                            };
                                break;
                            //处理等级信息
                            case "Level": {
                                try {
                                    QuestObj[ClientQuest[quest]._id].conditions.Level["LevelNeed"] = {}
                                    QuestObj[ClientQuest[quest]._id].conditions.Level["LevelNeed"].level = StartArr[i]._props.value
                                    QuestObj[ClientQuest[quest]._id].conditions.Level["LevelNeed"].require = StartArr[i]._props.compareMethod
                                }
                                catch (err) {
                                    CustomLog(err.message)
                                    CustomLog("QuestName: " + Locale[ClientQuest[quest]._id + " name"])
                                    CustomLog("QuestID: " + ClientQuest[quest]._id)
                                    CustomLog("ConditionType: Level")
                                }
                            }
                        }
                    }
                }
                if (FinishArr.length > 0) {
                    for (var j = 0; j < FinishArr.length; j++) {
                        switch (FinishArr[j]._parent) {
                            //处理上交物品信息
                            case "HandoverItem": {
                                try {
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]] = {}
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]]._id = FinishArr[j]._props.target[0]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].name = Locale[FinishArr[j]._props.target[0] + " Name"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].description = Locale[FinishArr[j]._props.target[0] + " Description"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].count = parseInt(FinishArr[j]._props.value)
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].type = FinishArr[j]._parent
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].onlyFindInRaid = FinishArr[j]._props.onlyFoundInRaid
                                    if (ClientItems[FinishArr[j]._props.target[0]] != undefined) {
                                        QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].isQuestItem = ClientItems[FinishArr[j]._props.target[0]]._props.QuestItem
                                    }
                                    else {
                                        QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].isQuestItem = false
                                        ErrIDArr.push(FinishArr[j]._props.target[0])
                                    }
                                }
                                catch (err) {
                                    CustomLog(err.message)
                                    CustomLog("QuestName: " + Locale[ClientQuest[quest]._id + " name"])
                                    CustomLog("QuestID: " + ClientQuest[quest]._id)
                                    CustomLog("ConditionType: HandoverItem")
                                }
                            };
                            //处理埋设物品信息
                            case "LeaveItemAtLocation": {
                                try {
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]] = {}
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]]._id = FinishArr[j]._props.target[0]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].name = Locale[FinishArr[j]._props.target[0] + " Name"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].description = Locale[FinishArr[j]._props.target[0] + " Description"]
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].count = parseInt(FinishArr[j]._props.value)
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].type = FinishArr[j]._parent
                                    QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].onlyFindInRaid = FinishArr[j]._props.onlyFoundInRaid
                                    if (ClientItems[FinishArr[j]._props.target[0]] != undefined) {
                                        QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].isQuestItem = ClientItems[FinishArr[j]._props.target[0]]._props.QuestItem
                                    }
                                    else {
                                        QuestObj[ClientQuest[quest]._id].conditions.Items[FinishArr[j]._props.target[0]].isQuestItem = false
                                        ErrIDArr.push(FinishArr[j]._props.target[0])
                                    }
                                }
                                catch (err) {
                                    CustomLog(err.message)
                                    CustomLog("QuestName: " + Locale[ClientQuest[quest]._id + " name"])
                                    CustomLog("QuestID: " + ClientQuest[quest]._id)
                                    CustomLog("ConditionType: LeaveItemAtLocation")
                                }
                            };
                                break;
                                break;
                            //处理改枪要求
                            case "WeaponAssembly": {
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]] = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]]._id = FinishArr[j]._props.target[0]
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].name = Locale[FinishArr[j]._props.target[0] + " Name"]
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Accuracy = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Accuracy.name = "精度（MOA）"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Accuracy.value = FinishArr[j]._props.baseAccuracy.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Accuracy.require = FinishArr[j]._props.baseAccuracy.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Durability = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Durability.name = "耐久"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Durability.value = FinishArr[j]._props.durability.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Durability.require = FinishArr[j]._props.durability.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Distance = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Distance.name = "有效射程"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Distance.value = FinishArr[j]._props.effectiveDistance.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Distance.require = FinishArr[j]._props.effectiveDistance.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Ergonomics = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Ergonomics.name = "人机功效"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Ergonomics.value = FinishArr[j]._props.ergonomics.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Ergonomics.require = FinishArr[j]._props.ergonomics.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Height = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Height.name = "高度"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Height.value = FinishArr[j]._props.height.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Height.require = FinishArr[j]._props.height.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Width = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Width.name = "长度"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Width.value = FinishArr[j]._props.width.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Width.require = FinishArr[j]._props.width.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.MagCount = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.MagCount.name = "弹匣容量"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.MagCount.value = FinishArr[j]._props.magazineCapacity.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.MagCount.require = FinishArr[j]._props.magazineCapacity.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Speed = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Speed.name = "膛口初速"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Speed.value = FinishArr[j]._props.muzzleVelocity.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Speed.require = FinishArr[j]._props.muzzleVelocity.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Recoil = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Recoil.name = "后坐力"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Recoil.value = FinishArr[j]._props.recoil.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Recoil.require = FinishArr[j]._props.recoil.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Weight = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Weight.name = "重量"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Weight.value = FinishArr[j]._props.weight.value
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.Weight.require = FinishArr[j]._props.weight.compareMethod
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.containItem = {}
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.containItem.name = "包含物品/标签"
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.containItem.item = FinishArr[j]._props.containsItems
                                QuestObj[ClientQuest[quest]._id].conditions.Assembly[FinishArr[j]._props.target[0]].conditions.containItem.Tag = FinishArr[j]._props.hasItemFromCategory

                            }
                        }
                    }
                }
            }
            /*//商人文件处理、构建
            var AssortObj = {}
            for (let trader in ClientDB.traders) {
                if (ClientDB.traders[trader].assort != undefined && trader != "579dc571d53a0658a154fbec") {
                    AssortObj[trader] = {}
                    AssortObj[trader]._id = trader
                    AssortObj[trader].name = Locale[trader + " Nickname"]
                    AssortObj[trader].Item = {}
                }
            }
            //详细数据处理
            for (let td in AssortObj) {
                var AssortArr = ClientDB.traders[AssortObj[td]._id].assort.items
                for (var i = 0; i < AssortArr.length; i++) {
                    if (AssortArr[i].parentId == "hideout") {
                        AssortObj[td].Item[AssortArr[i]._id] = {}
                        AssortObj[td].Item[AssortArr[i]._id]._id = AssortArr[i]._tpl
                        AssortObj[td].Item[AssortArr[i]._id].name = Locale[AssortArr[i]._tpl + " Name"]
                        AssortObj[td].Item[AssortArr[i]._id].level = ClientDB.traders[AssortObj[td]._id].assort.loyal_level_items[AssortArr[i]._id]
                        AssortObj[td].Item[AssortArr[i]._id].quest = {}
                        AssortObj[td].Item[AssortArr[i]._id].quest.QuestUnlock = false
                        if (AssortArr[i].upd.BuyRestrictionMax != undefined) {
                            AssortObj[td].Item[AssortArr[i]._id].BuyLimit = true
                            AssortObj[td].Item[AssortArr[i]._id].BuyLimitCount = AssortArr[i].upd.BuyRestrictionMax
                        }
                        else {
                            AssortObj[td].Item[AssortArr[i]._id].BuyLimit = false
                        }
                    }
                }
                for (let td2 in ClientDB.traders[AssortObj[td]._id].assort.barter_scheme) {
                    var Trading = ClientDB.traders[AssortObj[td]._id].assort.barter_scheme
                    for (var i = 0; i < Trading[td2][0].length; i++) {
                        AssortObj[td].Item[td2].Trading = {}
                        AssortObj[td].Item[td2].Trading[Trading[td2][0][i]._tpl] = {}
                    }
                    for (var i = 0; i < Trading[td2][0].length; i++) {
                        AssortObj[td].Item[td2].Trading[Trading[td2][0][i]._tpl] = {}
                        AssortObj[td].Item[td2].Trading[Trading[td2][0][i]._tpl]._id = Trading[td2][0][i]._tpl
                        AssortObj[td].Item[td2].Trading[Trading[td2][0][i]._tpl].name = Locale[Trading[td2][0][i]._tpl + " Name"]
                        AssortObj[td].Item[td2].Trading[Trading[td2][0][i]._tpl].count = Trading[td2][0][i].count
                    }
                }
                for (let qa in ClientDB.traders[AssortObj[td]._id].questassort.success) {
                    if (AssortObj[td].Item[qa] != undefined) {
                        AssortObj[td].Item[qa].quest.QuestUnlock = true
                        AssortObj[td].Item[qa].quest.questid = ClientDB.traders[AssortObj[td]._id].questassort.success[qa]
                        AssortObj[td].Item[qa].quest.questname = Locale[ClientDB.traders[AssortObj[td]._id].questassort.success[qa] + " name"]
                        AssortObj[td].Item[qa].quest.tradername = Locale[ClientDB.templates.quests[AssortObj[td].Item[qa].quest.questid].traderId + " Nickname"]
                    }
                }
            }*/
            //藏身处抽象处理、重构对象（第一个循环初始化数据，第二个循环读取存档数据完成重构）
            var AreaObj = {}
            for (var i = 0; i < Area.length; i++) {
                var type = Area[i].type
                AreaObj["Area" + type] = {}
                AreaObj["Area" + type].name = Local["hideout_area_" + type + "_name"]
                AreaObj["Area" + type].type = type
                AreaObj["Area" + type].level = {}
                for (let level in Area[i].stages) {
                    var stagelevel = JSON.stringify(level, null, 4).substring(1, 2)
                    AreaObj["Area" + type].level["level" + stagelevel] = {}
                    AreaObj["Area" + type].level["level" + stagelevel].Level = parseInt(stagelevel)
                    AreaObj["Area" + type].level["level" + stagelevel].Requirements = {}
                    var require = Area[i].stages[level].requirements
                    for (var j = 0; j < require.length; j++) {
                        if (require[j].type == "Item") {
                            AreaObj["Area" + type].level["level" + stagelevel].Requirements[Locale[require[j].templateId + " Name"]] = {}
                            AreaObj["Area" + type].level["level" + stagelevel].Requirements[Locale[require[j].templateId + " Name"]]._id = require[j].templateId
                            AreaObj["Area" + type].level["level" + stagelevel].Requirements[Locale[require[j].templateId + " Name"]].count = require[j].count
                        }
                    }
                }
            }
            //读取存档数据写入construct信息
            for (var i = 0; i < Hideout.length; i++) {
                var HideoutLevel = Hideout[i].level
                for (let obj in AreaObj["Area" + Hideout[i].type]) {
                    if (AreaObj["Area" + Hideout[i].type].level != undefined) {
                        for (let level in AreaObj["Area" + Hideout[i].type].level) {
                            if (HideoutLevel >= AreaObj["Area" + Hideout[i].type].level[level].Level) {
                                AreaObj["Area" + Hideout[i].type].level[level].Construct = true
                            }
                            else {
                                AreaObj["Area" + Hideout[i].type].level[level].Construct = false
                            }
                        }
                    }
                }
            }
            //将处理完的对象写入缓存文件
            VFS.writeFile(`${ModPath}HideoutCache.json`, JSON.stringify(AreaObj, null, 4))
            VFS.writeFile(`${ModPath}PriceCache.json`, JSON.stringify(PriceObj, null, 4))
            //重载缓存
            if (Cache.ReWriteCache == true) {
                VFS.writeFile(`${ModPath}ItemLocaleKeyCache.json`, JSON.stringify(LocaleObj, null, 4))
                VFS.writeFile(`${ModPath}QuestLocaleKeyCache.json`, JSON.stringify(QLocaleObj, null, 4))
                VFS.writeFile(`${ModPath}QuestCache.json`, JSON.stringify(QuestObj, null, 4))
                //VFS.writeFile(`${ModPath}AssortCache.json`, JSON.stringify(AssortObj, null, 4))
                //VFS.writeFile(`${ModPath}Cache.json`, JSON.stringify({ ReWriteCache: false }, null, 4))
            }
            //定义常量引用
            const LocaleJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}ItemLocaleKeyCache.json`));
            const QLocaleJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}QuestLocaleKeyCache.json`));
            const QuestJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}QuestCache.json`));
            const AreaJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}HideoutCache.json`));
            const PriceJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}PriceCache.json`));
            //const AssortJson = JsonUtil.deserialize(VFS.readFile(`${ModPath}AssortCache.json`));
            //清空物品本地化数据，从缓存重新写入
            for (let item in ClientItems) {
                Locale[ClientItems[item]._id + " Name"] = ""
                Locale[ClientItems[item]._id + " ShortName"] = ""
                Locale[ClientItems[item]._id + " Description"] = ""
                Locale[ClientItems[item]._id + " Name"] = LocaleJson[item].Name
                Locale[ClientItems[item]._id + " ShortName"] = LocaleJson[item].ShortName
                Locale[ClientItems[item]._id + " Description"] = LocaleJson[item].Description
            }
            for (var i = 0; i < ErrIDArr.length; i++) {
                Locale["MiniHUDCacheItem Description"] = Locale["MiniHUDCacheItem Description"] + "\n" + ErrIDArr[i]
            }
            //清空任务名和文本本地化数据，从缓存写入
            for (let quest in ClientQuest) {
                var QID = ClientQuest[quest]._id
                Locale[QID + " name"] = ""
                Locale[QID + " description"] = ""
                Locale[QID + " name"] = QLocaleJson[QID].Name
                Locale[QID + " description"] = QLocaleJson[QID].Description
            }
            //藏身处需求显示处理（重构完成）
            if (Config.HideoutInfo == true) {
                HUDLog("藏身处需求显示已开启。")
                for (let item in ClientItems) {
                    //初始化字符串数组以及字符串缓存
                    var StrArr = []
                    var Str = ""
                    //使用循环遍历缓存文件读取藏身处需求
                    for (let area in AreaJson) {
                        for (let level in AreaJson[area].level) {
                            for (let require in AreaJson[area].level[level].Requirements) {
                                //判断需求物品ID和物品ID相同且排除卢布、美元、欧元（判断两侧不可逆，否则会跳出循环）
                                if (AreaJson[area].level[level].Requirements[require]._id == ClientItems[item]._id && (AreaJson[area].level[level].Requirements[require]._id != ("5449016a4bdc2d6f028b456f" || "5696686a4bdc2da3298b456a" || "569668774bdc2da2298b4568"))) {
                                    //判断单位是否建成
                                    if (AreaJson[area].level[level].Construct == false) {
                                        //将未建成单位对应文本写入数组
                                        StrArr.push("<b><color=#" + MiscConfig["藏身处未拥有建筑需求颜色"] + "><size=18>" + "藏身处" + AreaJson[area].name + AreaJson[area].level[level].Level + "级需要" + AreaJson[area].level[level].Requirements[require].count + "个该物品，你尚未建造该区域；</b></color></size>")
                                    }
                                    else {
                                        //将已拥有单位对应文本写入数组
                                        StrArr.push("<b><color=#" + MiscConfig["藏身处已拥有建筑需求颜色"] + "><size=18>" + "藏身处" + AreaJson[area].name + AreaJson[area].level[level].Level + "级需要" + AreaJson[area].level[level].Requirements[require].count + "个该物品，你已经拥有该区域；</b></color></size>")
                                    }
                                }
                            }
                        }
                    }
                    //使用循环将数组内字符串写入字符串缓存
                    for (var j = 0; j < StrArr.length; j++) {
                        Str = Str + StrArr[j]
                    }
                    //判断字符串缓存是否为空
                    if (Str != "") {
                        //使用slice方法处理字符串末尾分号
                        var Str3 = Str.slice(0, -20) + "。\n"
                        //重新拼接字符串完成物品描述文本修改
                        Locale[ClientItems[item]._id + " Description"] = Str3 + "</b></color></size>" + Locale[ClientItems[item]._id + " Description"]
                        //清空字符串数组以及字符串缓存进入下次循环
                        StrArr = []
                        Str = ""
                    }
                }
            }
            //主线任务高亮（重构完成）
            if (Config.MainQuest == true) {
                HUDLog("主线任务高亮已开启。")
                var qid = "5c51aac186f77432ea65c552"
                for (let qt2 in QuestJson[qid].conditions.Prequest) {
                    var mainstr = "<b><color=#" + MiscConfig.主线任务颜色 + ">" + MiscConfig.主线任务标签
                    Locale[QuestJson[qid].conditions.Prequest[qt2]._id + " name"] = mainstr + Locale[QuestJson[qid].conditions.Prequest[qt2]._id + " name"] + "</color><b>"
                }
            }
            //任务物品需求（重构完成）
            if (Config.QuestItemInfo == true) {
                HUDLog("任务物品需求已开启。")
                for (let item in ClientItems) {
                    var itarr = []
                    var itstr = ""
                    var itemid = ClientItems[item]._id
                    for (let qt in QuestJson) {
                        for (let item2 in QuestJson[qt].conditions.Items) {
                            var ct = QuestJson[qt].conditions.Items[item2]
                            if (ct._id == itemid && (ct._id != ("5449016a4bdc2d6f028b456f" || "5696686a4bdc2da3298b456a" || "569668774bdc2da2298b4568"))) {
                                switch (ct.type) {
                                    case "HandoverItem": {
                                        switch (ct.onlyFindInRaid) {
                                            case true: {
                                                itarr.push("<b><size=18><color=#" + MiscConfig.任务物品带勾需求颜色 + ">" + QuestJson[qt].tradername + "的任务 " + QuestJson[qt].name + " 需要上交" + ct.count + "个在战局中找到的此物品，</b></size></color>")
                                            };
                                                break;
                                            case false: {
                                                itarr.push("<b><size=18><color=#" + MiscConfig.任务物品需求颜色 + ">" + QuestJson[qt].tradername + "的任务 " + QuestJson[qt].name + " 需要交付" + ct.count + "个此物品，</b></size></color>")
                                            };
                                                break;
                                        }
                                    };
                                        break;
                                    case "LeaveItemAtLocation": {
                                        itarr.push("<b><size=18><color=#" + MiscConfig.任务物品埋藏颜色 + ">" + QuestJson[qt].tradername + "的任务 " + QuestJson[qt].name + " 需要在指定地点安放" + ct.count + "个此物品，</b></size></color>")
                                    }
                                }
                            }
                        }
                    }
                    for (var i = 0; i < itarr.length; i++) {
                        itstr = itstr + itarr[i]
                    }
                    if (itstr != "") {
                        var itstr2 = itstr.slice(0, -20) + "。\n"
                        Locale[itemid + " Description"] = itstr2 + "</b></size></color>" + Locale[itemid + " Description"]
                        itstr = ""
                        itarr = []
                    }
                }
            }
            //商品相关（饿……以后再做）（在做了在做了）（做锤子，做不了，咕了）
            //#region 2
            /*
            if (Config.TradingInfo == false) {
                for (let td in AssortJson) {
                    for (let it in AssortJson[td].Item) {
                        if (AssortJson[td].Item[it]._id != "5449016a4bdc2d6f028b456f") {
                            if (AssortJson[td].Item[it]._id != "5696686a4bdc2da3298b456a") {
                                if (AssortJson[td].Item[it]._id != "569668774bdc2da2298b4568") {
                                    if (AssortJson[td].Item[it].quest.QuestUnlock == false) {
                                        for (let it2 in AssortJson[td].Item[it].Trading) {
                                            if (AssortJson[td].Item[it].Trading[it2]._id != "5449016a4bdc2d6f028b456f") {
                                                if (AssortJson[td].Item[it].Trading[it2]._id != "5696686a4bdc2da3298b456a") {
                                                    if (AssortJson[td].Item[it].Trading[it2]._id != "569668774bdc2da2298b4568") {
                                                        Locale[AssortJson[td].Item[it]._id + " Description"] = "<b><size=18><color=#66CCFF>该物品可在" + AssortJson[td].name + "信任等级达到" + AssortJson[td].Item[it].level + "级后换购。</color></size></b>\n" + Locale[AssortJson[td].Item[it]._id + " Description"]
                                                    }
                                                    else {
                                                        Locale[AssortJson[td].Item[it]._id + " Description"] = "<b><size=18><color=#66CCFF>该物品可在" + AssortJson[td].name + "信任等级达到" + AssortJson[td].Item[it].level + "级后购买。</color></size></b>\n" + Locale[AssortJson[td].Item[it]._id + " Description"]
                                                    }
                                                }
                                            }
                                            break
                                        }
                                    }
                                    if (AssortJson[td].Item[it].quest.QuestUnlock == true) {
                                        for (let it2 in AssortJson[td].Item[it].Trading) {
                                            if (AssortJson[td].Item[it].Trading[it2]._id != "5449016a4bdc2d6f028b456f") {
                                                if (AssortJson[td].Item[it].Trading[it2]._id != "5696686a4bdc2da3298b456a") {
                                                    if (AssortJson[td].Item[it].Trading[it2]._id != "569668774bdc2da2298b4568") {
                                                        Locale[AssortJson[td].Item[it]._id + " Description"] = "<b><size=18><color=#66CCFF>该物品可在" + AssortJson[td].name + "信任等级达到" + AssortJson[td].Item[it].level + "级后换购（需要完成" + AssortJson[td].Item[it].quest.tradername + "的任务 " + AssortJson[td].Item[it].quest.name + " ）。</color></size></b>\n" + Locale[AssortJson[td].Item[it]._id + " Description"]
                                                    }
                                                    else {
                                                        Locale[AssortJson[td].Item[it]._id + " Description"] = "<b><size=18><color=#66CCFF>该物品可在" + AssortJson[td].name + "信任等级达到" + AssortJson[td].Item[it].level + "级后购买（需要完成" + AssortJson[td].Item[it].quest.tradername + "的任务 " + AssortJson[td].Item[it].quest.name + " ）。</color></size></b>\n" + Locale[AssortJson[td].Item[it]._id + " Description"]
                                                    }
                                                }
                                            }
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/
            //#endregion
            //跳蚤市场开关
            if (Config.RagfairPrice == true) {
                HUDLog("跳蚤市场模式开启，物品价值参考将读取自跳蚤市场平均价格而非物品本身价值。")
            }
            //物品缩略名颜色（重构完成）
            if (Config.ItemPrice == true) {
                HUDLog("物品颜色已设置。")
                for (let item in ClientItems) {
                    for (let pc in PriceJson) {
                        var id = PriceJson[pc]._id
                        var price = PriceJson[pc].price
                        if (id == ClientItems[item]._id) {
                            if (price > 0 && price <= 1000) {
                                SetItemLevel(id, Garbage)
                            }
                            if (price > 1000 && price <= 10000) {
                                SetItemLevel(id, Normal)
                            }
                            if (price > 10000 && price <= 20000) {
                                SetItemLevel(id, Excellent)
                            }
                            if (price > 20000 && price <= 50000) {
                                SetItemLevel(id, Rare)
                            }
                            if (price > 50000 && price <= 100000) {
                                SetItemLevel(id, Epic)
                            }
                            if (price > 100000 && price <= 200000) {
                                SetItemLevel(id, Legend)
                            }
                            if (price > 200000 && price <= 500000) {
                                SetItemLevel(id, God)
                            }
                            if (price > 500000) {
                                SetItemLevel(id, EX)
                            }
                        }
                    }
                }
            }
            //物品颜色以及标签（重构完成）
            if (Config.ItemColor == true) {
                for (let item in ClientItems) {
                    for (let pc in PriceJson) {
                        var id = PriceJson[pc]._id
                        var price = PriceJson[pc].price
                        if (id == ClientItems[item]._id) {
                            if (price > 0 && price <= 1000) {
                                SetItemName(id, Garbage)
                            }
                            if (price > 1000 && price <= 10000) {
                                SetItemName(id, Normal)
                            }
                            if (price > 10000 && price <= 20000) {
                                SetItemName(id, Excellent)
                            }
                            if (price > 20000 && price <= 50000) {
                                SetItemName(id, Rare)
                            }
                            if (price > 50000 && price <= 100000) {
                                SetItemName(id, Epic)
                            }
                            if (price > 100000 && price <= 200000) {
                                SetItemName(id, Legend)
                            }
                            if (price > 200000 && price <= 500000) {
                                SetItemName(id, God)
                            }
                            if (price > 500000) {
                                SetItemName(id, EX)
                            }
                        }
                    }
                }
            }
            //物品前缀标签设置（重构完成）
            if (Config.LegendKey == true) {
                HUDLog("特殊前缀已设置。")
                for (let item in ClientItems) {
                    for (let pc in PriceJson) {
                        var id = PriceJson[pc]._id
                        var price = PriceJson[pc].price
                        if (id == ClientItems[item]._id) {
                            if (price > 0 && price <= 1000) {
                                SetItemNameWithTag(ClientItems[item]._id, Garbage, "<b>" + MiscConfig["废品标签"] + "</b>")
                            }
                            if (price > 1000 && price <= 10000) {
                                SetItemNameWithTag(ClientItems[item]._id, Normal, "<b>" + MiscConfig["普通标签"] + "</b>")
                            }
                            if (price > 10000 && price <= 20000) {
                                SetItemNameWithTag(ClientItems[item]._id, Excellent, "<b>" + MiscConfig["精良标签"] + "</b>")
                            }
                            if (price > 20000 && price <= 50000) {
                                SetItemNameWithTag(ClientItems[item]._id, Rare, "<b>" + MiscConfig["稀有标签"] + "</b>")
                            }
                            if (price > 50000 && price <= 100000) {
                                SetItemNameWithTag(ClientItems[item]._id, Epic, "<b>" + MiscConfig["史诗标签"] + "</b>")
                            }
                            if (price > 100000 && price <= 200000) {
                                SetItemNameWithTag(ClientItems[item]._id, Legend, "<b>" + MiscConfig["传奇标签"] + "</b>")
                            }
                            if (price > 200000 && price <= 500000) {
                                SetItemNameWithTag(ClientItems[item]._id, God, "<b>" + MiscConfig["神话标签"] + "</b>")
                            }
                            if (price > 500000) {
                                SetItemNameWithTag(ClientItems[item]._id, EX, "<b>" + MiscConfig["超越标签"] + "</b>")
                            }
                        }
                    }
                }
            }
            //弹药数据（仍需重构，咕了）
            if (Config.AmmoHUD == true) {
                HUDLog("子弹数据显示已开启。")
                for (let item in ClientItems) {
                    if (ClientItems[item]._parent == "5485a8684bdc2da71d8b4567") {
                        Locale[ClientItems[item]._id + " Description"] = "<b><align=center><size=20><color=#" + MiscConfig["子弹穿深颜色"] + ">穿深: </b>" + ClientItems[item]._props.PenetrationPower + "</color>  " + "<b><color=#" + MiscConfig["子弹肉伤颜色"] + ">肉伤: </b>" + ClientItems[item]._props.Damage + "</color>  " + "<b><color=#" + MiscConfig["子弹甲伤颜色"] + ">甲伤: </b>" + ClientItems[item]._props.ArmorDamage + "</color>  " + "<b><color=#" + MiscConfig["子弹甲伤颜色"] + ">数量: </b>" + ClientItems[item]._props.ProjectileCount + "</color></size></align>\n" + Locale[ClientItems[item]._id + " Description"]

                        if (ClientItems[item]._props.PenetrationPower < 20) {
                            ClientItems[item]._props.BackgroundColor = "default"
                        } if (ClientItems[item]._props.PenetrationPower >= 20) {
                            ClientItems[item]._props.BackgroundColor = "green"
                        } if (ClientItems[item]._props.PenetrationPower >= 30) {
                            ClientItems[item]._props.BackgroundColor = "blue"
                        } if (ClientItems[item]._props.PenetrationPower >= 40) {
                            ClientItems[item]._props.BackgroundColor = "violet"
                        } if (ClientItems[item]._props.PenetrationPower >= 50) {
                            ClientItems[item]._props.BackgroundColor = "yellow"
                        } if (ClientItems[item]._props.PenetrationPower >= 60) {
                            ClientItems[item]._props.BackgroundColor = "red"
                        }
                    }
                }
            }
            //护甲数据（仍需重构，咕了）
            if (Config.ArmorHUD == true) {
                HUDLog("护甲数据显示已开启。")
                for (let item in ClientItems) {
                    if (ClientItems[item]._parent == "5448e5284bdc2dcb718b4567" || ClientItems[item]._parent == "5448e54d4bdc2dcc718b4568") {
                        if (ClientItems[item]._props.armorClass > 0) {
                            var Armor = ClientDB.globals.config.ArmorMaterials
                            if (Armor[ClientItems[item]._props.ArmorMaterial] != null) {
                                Locale[ClientItems[item]._id + " Description"] = "<b><align=center><size=20><color=#" + MiscConfig["护甲钝伤颜色"] + ">钝伤系数: </b>" + (ClientItems[item]._props.BluntThroughput * 100) + "%</color>  " + "<b><color=#" + MiscConfig["护甲维修颜色"] + ">维修耐久损耗: </b>" + (Armor[ClientItems[item]._props.ArmorMaterial].MinRepairDegradation * 100) + "% - " + (Armor[ClientItems[item]._props.ArmorMaterial].MaxRepairDegradation * 100) + "%</color></align></size>" + "\n<align=center><size=20><b><color=#" + MiscConfig["护甲套件颜色"] + ">护甲维修包维修耐久损耗: </b>" + (Armor[ClientItems[item]._props.ArmorMaterial].MinRepairKitDegradation * 100) + "% - " + (Armor[ClientItems[item]._props.ArmorMaterial].MaxRepairKitDegradation * 100) + "%</color></size></align>\n" + Locale[ClientItems[item]._id + " Description"]
                                //logger.info(Armor[ClientItems[item]._props.ArmorMaterial])
                            }
                        }
                    }
                }
            }
            //参考价格（重构完成）
            if (Config.PriceHUD == true) {
                HUDLog("价格参考已开启。")
                for (let item in ClientItems) {
                    var size = ClientItems[item]._props.Width * ClientItems[item]._props.Height
                    for (let pc in PriceJson) {
                        var id = PriceJson[pc]._id
                        var price = PriceJson[pc].price
                        if (PriceJson[pc]._id == ClientItems[item]._id) {
                            if (Config.RagfairPrice == true) {
                                if (ClientItems[item]._props.CanSellOnRagfair == true) {
                                    Locale[id + " Description"] = "<b><size=20><align=center><color=#" + MiscConfig["物品价值颜色"] + ">当前市场参考价格: " + price + "</b></size></color>  " + "<b><size=20><color=#" + MiscConfig["单格价值颜色"] + ">单格价值: " + (Math.floor(price / size)) + "</b></size></align></color>\n" + Locale[id + " Description"]
                                }
                                else {
                                    Locale[id + " Description"] = "<b><size=20><align=center><color=#" + MiscConfig["物品价值颜色"] + ">参考价值: " + price + "</b></size></color>  " + "<b><size=20><color=#" + MiscConfig["单格价值颜色"] + ">参考单格价值: " + (Math.floor(price / size)) + "</b></size></align></color>\n" + Locale[id + " Description"]
                                }
                            }
                            else {
                                Locale[id + " Description"] = "<b><size=20><align=center><color=#" + MiscConfig["物品价值颜色"] + ">参考价值: " + price + "</b></size></color>  " + "<b><size=20><color=#" + MiscConfig["单格价值颜色"] + ">参考单格价值: " + (Math.floor(price / size)) + "</b></size></align></color>\n" + Locale[id + " Description"]
                            }
                        }
                    }
                }
            }
            //物品全检视（无需重构）
            if (Config.ExamineByDefault == true) {
                HUDLog("物品已全部检视完毕。")
                for (let item in ClientItems) {
                    ClientDB.templates.items[item]._props.ExaminedByDefault = true
                }
            }
            //唯一任务物品需求（重构完了）
            if (Config.QuestItemDisplay == true) {
                HUDLog("唯一任务物品需求已开启。")
                for (let qt in QuestJson) {
                    var qiarr = []
                    var qistr = ""
                    for (let cd in QuestJson[qt].conditions.Items) {
                        if (QuestJson[qt].conditions.Items[cd]) {
                            if (QuestJson[qt].conditions.Items[cd].type == "HandoverItem") {
                                if (QuestJson[qt].conditions.Items[cd].isQuestItem == true) {
                                    qiarr.push("<b><color=#" + MiscConfig["唯一任务物品需求颜色"] + "><size=18>" + QuestJson[qt].conditions.Items[cd].name + "、</b></color></size>")
                                }
                            }
                        }
                    }
                    if (qiarr.length > 0) {
                        for (var i = 0; i < qiarr.length; i++) {
                            qistr = qistr + qiarr[i]
                        }
                        qiarr = []
                    }
                    if (qistr != "") {
                        var qistr2 = "<b><color=#" + MiscConfig["唯一任务物品需求颜色"] + "><size=18>此任务需要上交唯一任务物品：" + "</b></color></size>" + qistr.slice(0, -20) + "。\n"
                        qistr = ""
                    }
                    Locale[QuestJson[qt]._id + " description"] = qistr2 + "</b></color></size>" + Locale[QuestJson[qt]._id + " description"]
                    qistr2 = ""
                }
            }
            //信任度需求（重构完了+1）
            if (Config.QuestLLRDisplay == true) {
                HUDLog("任务信任度需求显示开启。")
                for (let qt in QuestJson) {
                    var llrstr = ""
                    for (let cd in QuestJson[qt].conditions.Loyalty) {
                        if (QuestJson[qt].conditions.Loyalty[cd]) {
                            if (QuestJson[qt].conditions.Loyalty[cd].require == ">=") {
                                llrstr = "<b><color=#" + MiscConfig["任务信任度需求颜色"] + "><size=18>此任务需要" + QuestJson[qt].tradername + "信任等级达到" + QuestJson[qt].conditions.Loyalty[cd].value + "级。</b></color></size>\n"
                            }
                            else {
                                llrstr = "<b><color=#" + MiscConfig["任务信任度需求颜色"] + "><size=18>此任务需要" + QuestJson[qt].tradername + "信任度低于" + QuestJson[qt].conditions.Loyalty[cd].value + "点。</b></color></size>\n"
                            }
                        }
                    }
                    Locale[QuestJson[qt]._id + " description"] = llrstr + Locale[QuestJson[qt]._id + " description"]
                    llrstr = ""
                }
            }
            //后续任务（重构完了+2）
            if (Config.QuestUnlock == true) {
                HUDLog("后续任务显示已开启。")
                for (let qt in QuestJson) {
                    var qtarr = []
                    var qtstr = ""
                    for (let cd in QuestJson[qt].conditions.Unlock) {
                        qtarr.push("<b><color=#" + MiscConfig["后续任务颜色"] + ">" + QuestJson[qt].conditions.Unlock[cd].name + "（" + QuestJson[qt].conditions.Unlock[cd].tradername + "）、</color></b>")
                    }
                    for (var i = 0; i < qtarr.length; i++) {
                        qtstr = qtstr + qtarr[i]
                    }
                    if (qtstr != "") {
                        var qtstr2 = "<b><color=#" + MiscConfig["后续任务颜色"] + ">" + "后续任务：</color></b>" + qtstr.slice(0, -13) + "。</color></b>\n"
                    }
                    Locale[QuestJson[qt]._id + " description"] = qtstr2 + Locale[QuestJson[qt]._id + " description"]
                    qtarr = []
                    qtstr = ""
                    qtstr2 = ""
                }
            }
            //任务前置要求（修不好，开摆）
            if (Config.QuestRequire == true) {
                HUDLog("任务前置要求显示开启。")
                for (let quest in ClientDB.templates.quests) {
                    var Conditions = ClientDB.templates.quests[quest].conditions.AvailableForFinish
                    if (Config.QuestRequire == true) {
                        var QuestID = ClientDB.templates.quests[quest]._id
                        var Start = ClientDB.templates.quests[quest].conditions.AvailableForStart
                        if (Start.length > 0) {
                            for (var i = 0; i < Start.length; i++) {
                                if (Start[i]._parent == "Quest" && Start[i]._props.status[0] == 4) {
                                    Locale[QuestID + " description"] = "<b><color=#" + MiscConfig["任务前置要求颜色"] + ">" + "前置要求: 完成任务 " + Locale[Start[i]._props.target + " name"] + " (" + Locale[ClientDB.templates.quests[Start[i]._props.target].traderId + " Nickname"] + ") " + ", </color></b>" + Locale[QuestID + " description"]
                                }
                                if (Start[i]._parent == "Quest" && Start[i]._props.status[0] == 5) {
                                    Locale[QuestID + " description"] = "<b><color=#" + MiscConfig["任务前置要求颜色"] + ">" + "前置要求: 任务 " + Locale[Start[i]._props.target + " name"] + " (" + Locale[ClientDB.templates.quests[Start[i]._props.target].traderId + " Nickname"] + ") 失败" + ", </color></b>" + Locale[QuestID + " description"]
                                }
                                if (Start[i]._parent == "Quest" && Start[i]._props.status[0] == 2) {
                                    Locale[QuestID + " description"] = "<b><color=#" + MiscConfig["任务前置要求颜色"] + ">" + "前置要求: 接取任务 " + Locale[Start[i]._props.target + " name"] + " (" + Locale[ClientDB.templates.quests[Start[i]._props.target].traderId + " Nickname"] + ") " + ", </color></b>" + Locale[QuestID + " description"]
                                }

                            }
                        }
                    }
                }
            }
            //任务等级需求（懒得修了，继续摆）
            if (Config.QuestLevelNeed == true) {
                HUDLog("任务等级需求显示开启。")
                for (let quest in ClientDB.templates.quests) {
                    var Conditions = ClientDB.templates.quests[quest].conditions.AvailableForFinish
                    if (Config.QuestLevelNeed == true) {

                        var QuestID = ClientDB.templates.quests[quest]._id
                        var Start = ClientDB.templates.quests[quest].conditions.AvailableForStart
                        if (Start.length > 0) {
                            for (var i = 0; i < Start.length; i++) {
                                if (Start[i]._parent == "Level") {
                                    Locale[QuestID + " description"] = "<b><color=#" + MiscConfig["任务等级需求颜色"] + ">" + "等级要求: " + Start[i]._props.value + ", </color></b>" + Locale[QuestID + " description"]
                                }
                            }
                        }
                    }
                }
            }
            var arr5 = []
            //枪匠小帮手（实在不想重写，开摆！）
            if (Config.GunsmithHelper == true) {
                HUDLog("枪匠小帮手已启动。")
                for (let quest in ClientDB.templates.quests) {
                    var Conditions = ClientDB.templates.quests[quest].conditions.AvailableForFinish
                    var QuestID = ClientDB.templates.quests[quest]._id
                    var QuestName = Locale[QuestID + " name"]
                    for (var i = 0; i < Conditions.length; i++) {
                        if (Conditions[i]._parent == "WeaponAssembly") {
                            var Target = Conditions[i]._props.target[0]
                            var Durability = Conditions[i]._props.durability.value
                            var DistanceStr = ""
                            var Distance = Conditions[i]._props.effectiveDistance.value
                            if (Distance > 0) {
                                DistanceStr = "有效射程大于" + Distance + "米, "
                            }
                            else {
                                DistanceStr = ""
                            }
                            var Ergonomics = Conditions[i]._props.ergonomics.value
                            var HightStr = ""
                            var HightLimit = Conditions[i]._props.height.value
                            if (HightLimit != 0) {
                                if (Conditions[i]._props.height.compareMethod == ">=") {
                                    HightStr = "高度至少" + HightLimit + "格, "
                                }
                                else if (Conditions[i]._props.height.compareMethod == "<=") {
                                    HightStr = "高度不能超过" + HightLimit + "格, "
                                }
                                else {
                                    HightStr = ""
                                }
                            }
                            var MagStr = ""
                            var MagContainer = Conditions[i]._props.magazineCapacity.value
                            if (MagContainer > 0) {
                                MagStr = "要有" + MagContainer + "发弹匣, "
                            }
                            else {
                                MagStr = ""
                            }
                            var RecoilLimit = Conditions[i]._props.recoil.value
                            var WeightStr = ""
                            var Weight = Conditions[i]._props.weight.value
                            if (Conditions[i]._props.weight.compareMethod == "<=") {
                                WeightStr = "重量低于" + Weight + "公斤, "
                            }
                            else {
                                WeightStr = ""
                            }
                            var WidthStr = ""
                            var WidthLimit = Conditions[i]._props.width.value
                            if (WidthLimit != 0) {
                                if (Conditions[i]._props.width.compareMethod == ">=") {
                                    WidthStr = "长度至少" + WidthLimit + "格, "
                                }
                                else if (Conditions[i]._props.width.compareMethod == "<=") {
                                    WidthStr = "长度最多" + WidthLimit + "格, "
                                }
                                else {
                                    WidthStr = ""
                                }
                            }
                            var ModTagString = "要有"
                            var ModTagArr = Conditions[i]._props.hasItemFromCategory
                            var ModNeedString = "必须装有"
                            var ModNeedArr = Conditions[i]._props.containsItems
                            if (ModTagArr.length > 0) {
                                for (var j = 0; j < ModTagArr.length; j++) {
                                    ModTagString = ModTagString + Locale[ModTagArr[j] + " Name"] + ", "
                                }
                            }
                            else {
                                ModTagString = ""
                            }
                            if (ModNeedArr.length > 0) {
                                for (var k = 0; k < ModNeedArr.length; k++) {
                                    ModNeedString = ModNeedString + Locale[ModNeedArr[k] + " Name"] + ", "
                                }
                            }
                            else {
                                ModNeedString = ""
                            }
                            var LogString = "\n本任务改装目标: " + Locale[Target + " Name"] + "\n本任务改装要求: 耐久大于" + Durability + ", " + DistanceStr + "人机功效至少" + Ergonomics + ", 后坐力总和小于" + RecoilLimit + ", " + MagStr + HightStr + WidthStr + ModTagString + ModNeedString
                            var GunSmith = LogString.slice(0, -2) + "。"
                            DistanceStr = ""
                            HightStr = ""
                            MagStr = ""
                            WeightStr = ""
                            WidthStr = ""
                            ModTagString = ""
                            ModNeedString = ""
                            Locale[QuestID + " description"] = "\n<b><color=#" + MiscConfig["枪匠小帮手颜色"] + ">枪匠小帮手提醒您: " + GunSmith + "</b></color>\n" + Locale[QuestID + " description"]
                            //CustomLog(Locale[QuestID + " name"] + GunSmith)
                            arr5.push(Locale[QuestID + " name"] + GunSmith)
                        }
                    }
                }
            }
            var obj5 = {}
            for (var i = 0; i < arr5.length; i++) {
                obj5["枪匠" + i] = {}
                obj5["枪匠" + i].key = "枪匠" + i
                obj5["枪匠" + i].matchType = "full"
                obj5["枪匠" + i].matchPlace = "3"
                obj5["枪匠" + i].priority = 0
                obj5["枪匠" + i].value = arr5[i]
            }
            //VFS.writeFile(`${ModPath}obj5.json`, JSON.stringify(obj5, null, 4))
            //显示未知奖励（无需重构）
            if (Config.NoHideReward == true) {
                HUDLog("所有隐藏奖励现已可见。")
                for (let quest in ClientDB.templates.quests) {
                    var Reward = ClientDB.templates.quests[quest].rewards.Success
                    if (Config.NoHideReward == true) {
                        try {
                            for (var i = 0; i < Reward.length; i++) {
                                if (Reward[i].unknown != null) {
                                    Reward[i].unknown = false
                                }
                            }
                        }
                        catch (err) {
                            CustomDenied("RewardLengthError")
                            CustomDenied(err.message)
                            CustomDenied(ClientDB.templates.quests[quest]._id)
                        }
                    }
                }
            }
            //手雷有烟无伤（无需重构）
            if (DebugConfig.FireworkGrenade == true) {
                HUDLog("烟花手雷已启用。")
                for (let item in ClientDB.templates.items) {
                    ClientDB.templates.items[item]._props.FragmentsCount = 0
                    ClientDB.templates.items[item]._props.Strength = 0
                }
            }
            //羽落(摔落保护)（无需重构）
            if (DebugConfig.FeatherFall == true) {
                HUDLog("羽落已开启。")
                ClientDB.globals.config.Health.Falling.DamagePerMeter = 0;
                ClientDB.globals.config.Health.Falling.SafeHeight = 999;
            }
            //Debug功能（无需重构）
            if (DebugConfig.NoQuestRequire == true) {
                HUDLog("Debug功能已开启，任务可直接完成。")
                for (let quest in ClientDB.templates.quests) {
                    ClientDB.templates.quests[quest].conditions.AvailableForFinish = []
                    //Start = [ ]
                }
            }
            //名称重设（无需重构）
            if (Config.ResetName == true) {
                HUDLog("PMC名称重设已启用。")
                ClientDB.bots.types.bear.firstName = Name.Bear
                //ClientDB.bots.types.pmcbot.firstName = Name.Bear
                ClientDB.bots.types.usec.firstName = Name.Bear
            }
            //任务全解锁
            if (DebugConfig.NoQuestNeed == true) {
                HUDLog("Debug功能已开启，所有任务已解锁。")
                for (let quest in ClientDB.templates.quests) {
                    var Start = ClientDB.templates.quests[quest].conditions.AvailableForStart
                    var Finish = ClientDB.templates.quests[quest].conditions.AvailableForFinish
                    var Reward = ClientDB.templates.quests[quest].rewards.Success
                    try {
                        if (Start.length > 0) {
                            Start.splice(0, Start.length)
                        }
                    }
                    catch (err) {
                        CustomDenied("StartLengthError")
                        CustomDenied(err.message)
                        CustomDenied(ClientDB.templates.quests[quest]._id)
                    }
                    try {
                        if (Finish.length > 0) {
                            for (var i = 0; i < Finish.length; i++) {
                                if (Finish[i]._props.visibilityConditions) {
                                    Finish[i]._props.visibilityConditions.splice(0, Finish[i]._props.visibilityConditions.length)
                                }
                            }
                        }
                    }
                    catch (err) {
                        CustomDenied("FinishLengthError")
                        CustomDenied(err.message)
                        CustomDenied(ClientDB.templates.quests[quest]._id)
                    }
                }
            }
            //全条件可见
            if (Config.NoHideConditions == true) {
                HUDLog("所有隐藏条件现已可见。")
                for (let quest in ClientDB.templates.quests) {
                    var Finish = ClientDB.templates.quests[quest].conditions.AvailableForFinish
                    try {
                        if (Finish.length) {
                            if (Finish.length > 0) {
                                for (var i = 0; i < Finish.length; i++) {
                                    if (Finish[i]._props.visibilityConditions) {
                                        Finish[i]._props.visibilityConditions.splice(0, Finish[i]._props.visibilityConditions.length)
                                    }
                                }
                            }
                        }
                    }
                    catch (err) {
                        CustomDenied(err.message)
                        CustomDenied(ClientDB.templates.quests[quest]._id)
                    }
                }
            }
            HUDLog("载入成功。")
            VFS.writeFile(`${ModPath}Cache.json`, JSON.stringify({ ReWriteCache: false }, null, 4))
        }
        function SetItemLevel(ID, level) {
            Locale[ID + " ShortName"] = "<color=#" + level + ">" + Locale[ID + " ShortName"] + "</color>"
        }
        function SetItemName(ID, level) {
            Locale[ID + " Name"] = "<color=#" + level + ">" + Locale[ID + " Name"] + "</color>"
        }
        function SetItemNameWithTag(ID, level, string) {
            Locale[ID + " Name"] = "<color=#" + level + ">" + string + "</color>" + Locale[ID + " Name"]
        }
        function HUDLog(string) {
            logger.logWithColor("[MiniHUD]: " + string, "green");
        }
        function CustomLog(string) {
            logger.logWithColor("[Console]: " + string, "yellow");
        }
        function CustomAccess(string) {
            logger.logWithColor("[Console]: " + string, "green");
        }
        function CustomDenied(string) {
            logger.logWithColor("[Console]: " + string, "red");
        }
        //region 废弃代码
        /*
        var arr = ["FF0000", "00FF00", "0000FF"]
        setInterval(()=>{for(let i=0; i<arr.length; i++){
            setTimeout(() => {
                ClientDB.locales.global["ch"].templates["59faff1d86f7746c51718c9c"].Name = "<color=#" + arr[i] +">" + "实体比特币" + "</color>" 
                logger.info(ClientDB.locales.global["ch"].templates["59faff1d86f7746c51718c9c"].Name)
                //console.log(i);
         }, 1000 * i)
        }}, 3000)*/
        //endregion
    }
    public getItemMinAvgMaxFleaPriceValues(getPriceRequest: IGetMarketPriceRequestData): IGetItemPriceResult {
        // Get all items of tpl (sort by price)
        const ragfairController = Mod.container.resolve<RagfairController>("RagfairController")
        const FuncDatabaseServer = Mod.container.resolve<DatabaseServer>("DatabaseServer");
        const ragfairSortHelper = Mod.container.resolve<RagfairSortHelper>("RagfairSortHelper");
        //const ragfairSort = Mod.container.resolve<RagfairSort>("RagfairSort");
        const JsonUtil = Mod.container.resolve<JsonUtil>("JsonUtil");
        const logger = Mod.container.resolve<ILogger>("WinstonLogger");
        let offers = ragfairController.ragfairOfferService.getOffersOfType(getPriceRequest.templateId);

        // Offers exist for item, get averages of what's listed
        if (typeof (offers) === "object" && offers.length > 0) {
            offers = ragfairController.ragfairSortHelper.sortOffers(offers, RagfairSort.PRICE);
            //logger.info(JSON.stringify(offers, null, 4))
            const min = offers[0].requirementsCost; // Get first item from array as its pre-sorted
            const max = offers.at(-1).requirementsCost; // Get last item from array as its pre-sorted
            //计算调和平均
            //var count2 = 0
            //var price3 = 0
            //for(var i = 0; i < offers.length; i++){
            //    count2 = i
            //    var price1 = offers[i].requirementsCost
            //    var price2 = 1/price1
            //    price3 += price2
            //}
            var med = offers[Math.floor(offers.length / 2)].requirementsCost
            //count2 = 0
            //price3 = 0
            //const med = offers[Math.trunc((offers.length / 2))].requirementsCost; // Get last item from array as its pre-sorted
            return {
                avg: med,
                min: min,
                max: max
            };
        }
        else // No offers listed, get price from live ragfair price list prices.json
        {
            const templatesDb = FuncDatabaseServer.getTables().templates;

            let tplPrice = templatesDb.prices[getPriceRequest.templateId];
            if (!tplPrice) {
                // No flea price, get handbook price
                tplPrice = ragfairController.handbookHelper.getTemplatePrice(getPriceRequest.templateId);
            }

            return {
                avg: tplPrice,
                min: tplPrice,
                max: tplPrice
            };
        }
    }
}
module.exports = { mod: new Mod() }