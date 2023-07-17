"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Common_1 = require("./Method/Common");
const Data_1 = require("./Method/Data");
const Cache_1 = require("./Method/Cache");
//
class Mod {
    preAkiLoad(container) {
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const staticRouterModService = container.resolve("StaticRouterModService");
        const imageRouter = container.resolve("ImageRouter");
        container.register("Common", Common_1.Common, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("Data", Data_1.Data, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("Cache", Cache_1.Cache, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        Mod.container = container;
        staticRouterModService.registerStaticRouter("StaticRouteMiniHUDStart", [
            {
                url: "/launcher/profile/compatibleTarkovVersion",
                action: (url, info, sessionId, output) => {
                    //var saveversion = profileHelper.getFullProfile(sessionId).info.edition
                    //logger.info("Hook Awaked.")
                    this.MiniHUDStart(container, sessionId);
                    return output;
                }
            }
        ], "aki");
    }
    postAkiLoad(container) {
        const Logger = container.resolve("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve("DatabaseServer");
        const FuncImporterUtil = container.resolve("ImporterUtil");
        const VFS = container.resolve("VFS");
        const JsonUtil = container.resolve("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("MiniHUD-Reborn");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`);
    }
    postDBLoad(container) {
        const Logger = container.resolve("WinstonLogger");
        const Common = container.resolve("Common");
        const Data = container.resolve("Data");
        const Cache = container.resolve("Cache");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve("DatabaseServer");
        const imageRouter = container.resolve("ImageRouter");
        const FuncImporterUtil = container.resolve("ImporterUtil");
        const VFS = container.resolve("VFS");
        const JsonUtil = container.resolve("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = Common.ModPath;
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`);
        const AllItems = ClientDB.templates.items;
        var Therapist = "5ac3b934156ae10c4430e83c";
        var Therapist2 = "54cb57776803fa99248b456e";
        var AssortData = ClientDB.traders[Therapist].assort;
        const Locale = ClientDB.locales.global["ch"];
        const ELocale = ClientDB.locales.global["en"];
        Common.checkUpdate(Common.Config.Main.Link.Update, Common.Config.Main.Link.Download, Common.Config.Main.Link.Github, Common.Config.Main.Link.Gitee);
        Common.getAnnouncement(Common.Config.Main.Link.Announcement);
        Data.addItem();
        Data.addQuest();
        //Data.addAssort("天使飞越那无尽宇宙");
        Data.addSpawn();
        const iconPath = `${ModPath}images/quests/`;
        const iconList = VFS.getFiles(iconPath);
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        //名称重设
        if (Common.Config.Main.Display.NameReplace == true) {
            ClientDB.bots.types.bear.firstName = Name.Bear;
            ClientDB.bots.types.usec.firstName = Name.Bear;
        }
        for (const icon of iconList) {
            const filename = VFS.stripExtension(icon);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${iconPath}${icon}`);
        }
        for (let key in DB.achievementlocale) {
            ClientDB.locales.global["ch"][key] = DB.achievementlocale[key];
        }
        //VFS.writeFile(`${ModPath}Cache/ItemLocaleKeyCache.json`, JSON.stringify(ItemLocaleKeyCache, null, 4))
        //VFS.writeFile(`${ModPath}suit.json`, JSON.stringify(ClientDB.traders["5ac3b934156ae10c4430e83c"].suits, null, 4))
    }
    MiniHUDStart(container, sessionId) {
        const Logger = container.resolve("WinstonLogger");
        const Common = container.resolve("Common");
        const Data = container.resolve("Data");
        const Cache = container.resolve("Cache");
        const logger = container.resolve("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve("DatabaseServer");
        const FuncImporterUtil = container.resolve("ImporterUtil");
        const JsonUtil = container.resolve("JsonUtil");
        const VFS = container.resolve("VFS");
        const profileHelper = container.resolve("ProfileHelper");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = Common.ModPath;
        const ragfairController = container.resolve("RagfairController");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`);
        //const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const ClientItems = ClientDB.templates.items;
        const ClientQuest = ClientDB.templates.quests;
        const PriceMap = Data.BuildPriceTab();
        const Config = Common.Config;
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const start = performance.now();
        if (Config.Main.LoginTrigger == true) {
            if (Common.Config.Main.Display.NameReplace == true) {
                ClientDB.bots.types.bear.firstName = Name.Bear;
                ClientDB.bots.types.usec.firstName = Name.Bear;
            }
            Common.Log(`检测为第一次登陆游戏，正在初始化数据…`);
            Cache.writeItemLocaleKeyCache();
            Cache.writeQuestLocaleKeyCache();
            Cache.writeTraderCache();
            Cache.writrQuestDataCache();
            Common.Log("正在建立价格映射…");
            Cache.writeItemPriceCache(PriceMap);
        }
        else {
            Common.Log(`正在初始化数据…`);
        }
        if (Config.Main.LoginTrigger == true) {
            Data.setItemData(PriceMap);
            Data.setQuestData();
            Config.Main.LoginTrigger = false;
            Data.addQuest();
        }
        const end = performance.now();
        Common.Notice(`所有数据初始化完毕！共耗时${Common.formatTime(end - start)}`);
    }
}
module.exports = { mod: new Mod() };
