import { inject, injectable, container, DependencyContainer, Lifecycle } from "tsyringe";
import crypto from "crypto";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { DialogueHelper } from "@spt-aki/helpers/DialogueHelper";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { IModLoader } from "@spt-aki/models/spt/mod/IModLoader";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Traders } from "@spt-aki/models/enums/Traders";
import { QuestStatus } from "@spt-aki/models/enums/QuestStatus";
import { MessageType } from "@spt-aki/models/enums/MessageType";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { VFS } from "@spt-aki/utils/VFS"
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { NotificationSendHelper } from "@spt-aki/helpers/NotificationSendHelper";
import { NotifierHelper } from "@spt-aki/helpers/NotifierHelper";
import { QuestHelper } from "@spt-aki/helpers/QuestHelper";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil"
import { BundleLoader } from "@spt-aki/loaders/BundleLoader";
import { Common } from "./Method/Common";
import { Data } from "./Method/Data";
import { Cache } from "./Method/Cache";
//
class Mod implements IPreAkiLoadMod {
    private static container: DependencyContainer;
    public preAkiLoad(container: DependencyContainer): void {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
        container.register<Common>("Common", Common, { lifecycle: Lifecycle.Singleton });
        container.register<Data>("Data", Data, { lifecycle: Lifecycle.Singleton });
        container.register<Cache>("Cache", Cache, { lifecycle: Lifecycle.Singleton });
        Mod.container = container;
        staticRouterModService.registerStaticRouter(
            "StaticRouteMiniHUDStart",
            [
                {
                    url: "/launcher/profile/compatibleTarkovVersion",
                    action: (url, info, sessionId, output) => {
                        //var saveversion = profileHelper.getFullProfile(sessionId).info.edition
                        //logger.info("Hook Awaked.")
                        this.MiniHUDStart(container, sessionId)
                        return output;
                    }
                }
            ],
            "aki"
        );
    }
    public postAkiLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("MiniHUD-Reborn")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
    }
    public postDBLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const Common = container.resolve<Common>("Common");
        const Data = container.resolve<Data>("Data");
        const Cache = container.resolve<Cache>("Cache");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = Common.ModPath
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const AllItems = ClientDB.templates.items;
        var Therapist = "5ac3b934156ae10c4430e83c"
        var Therapist2 = "54cb57776803fa99248b456e"
        var AssortData = ClientDB.traders[Therapist].assort
        const Locale = ClientDB.locales.global["ch"]
        const ELocale = ClientDB.locales.global["en"]
        Common.checkUpdate(Common.Config.Main.Link.Update, Common.Config.Main.Link.Download, Common.Config.Main.Link.Github, Common.Config.Main.Link.Gitee)
        Common.getAnnouncement(Common.Config.Main.Link.Announcement)
        Common.getUpdateLog(Common.Config.Main.Link.UpdateLog)
        Data.addItem();
        Data.addQuest();
        //Data.addAssort("天使飞越那无尽宇宙");
        //Data.addAssort("AT的钥匙卡");
        //ClientDB.locations.tarkovstreets.looseLoot.spawnpointsForced = []
        //ClientDB.locations.tarkovstreets.looseLoot.spawnpoints = []
        Data.addSpawn();
        const iconPath = `${ModPath}images/quests/`
        const iconList = VFS.getFiles(iconPath);
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        //名称重设
        if (Common.Config.Main.Display.NameReplace == true) {
            ClientDB.bots.types.bear.firstName = Name.Bear
            ClientDB.bots.types.usec.firstName = Name.Bear
        }
        for (const icon of iconList) {
            const filename = VFS.stripExtension(icon);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${iconPath}${icon}`);
        }
        for (let key in DB.achievementlocale) {
            ClientDB.locales.global["ch"][key] = DB.achievementlocale[key]
        }
        //VFS.writeFile(`${ModPath}Cache/ItemLocaleKeyCache.json`, JSON.stringify(ItemLocaleKeyCache, null, 4))

        //VFS.writeFile(`${ModPath}suit.json`, JSON.stringify(ClientDB.traders["5ac3b934156ae10c4430e83c"].suits, null, 4))

    }
    public MiniHUDStart(container: DependencyContainer, sessionId: String): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const Common = container.resolve<Common>("Common");
        const Data = container.resolve<Data>("Data");
        const Cache = container.resolve<Cache>("Cache");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const VFS = container.resolve<VFS>("VFS");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = Common.ModPath
        const ragfairController = container.resolve("RagfairController");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        //const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const ClientItems = ClientDB.templates.items
        const ClientQuest = ClientDB.templates.quests
        const PriceMap = Data.BuildPriceTab()
        const Config = Common.Config
        const Name = JsonUtil.deserialize(VFS.readFile(`${ModPath}Name.json`));
        const start = performance.now()
        if (Config.Main.LoginTrigger == true) {
            if (Common.Config.Main.Display.NameReplace == true) {
                ClientDB.bots.types.bear.firstName = Name.Bear
                ClientDB.bots.types.usec.firstName = Name.Bear
            }
            Common.Log(`检测为第一次登陆游戏，正在初始化数据…`)
            Cache.writeItemLocaleKeyCache();
            Cache.writeQuestLocaleKeyCache();
            Cache.writeTraderCache();
            Cache.writrQuestDataCache();
            Common.Log("正在建立价格映射…");
            Cache.writeItemPriceCache(PriceMap);
        }
        else {
            Common.Log(`正在初始化数据…`)
        }
        if (Config.Main.LoginTrigger == true) {
            Data.setItemData(PriceMap);
            Data.setQuestData();
            Data.addQuest();
            Config.Main.LoginTrigger = false
        }
        const end = performance.now()
        Common.Notice(`所有数据初始化完毕！共耗时${Common.formatTime(end - start)}`)
    }
}
module.exports = { mod: new Mod() }