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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ImporterUtil_1 = require("C:/snapshot/project/obj/utils/ImporterUtil");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const RagfairController_1 = require("C:/snapshot/project/obj/controllers/RagfairController");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("C:/snapshot/project/obj/utils/VFS");
const Common_1 = require("./Common");
let Data = class Data {
    constructor(logger, importUtil, databaseServer, ragfair, json, vfs, common) {
        this.logger = logger;
        this.importUtil = importUtil;
        this.databaseServer = databaseServer;
        this.ragfair = ragfair;
        this.json = json;
        this.vfs = vfs;
        this.common = common;
        this.LevelMap = [this.common.Lv0, this.common.Lv1, this.common.Lv2, this.common.Lv3, this.common.Lv4, this.common.Lv5, this.common.Lv6, this.common.Lv7];
        this.TagMap = [this.common.Tag0, this.common.Tag1, this.common.Tag2, this.common.Tag3, this.common.Tag4, this.common.Tag5, this.common.Tag6, this.common.Tag7];
    }
    //public PriceTab = this.BuildPriceTab();
    getItem(itemid) {
        return this.common.DB.templates.items[itemid];
    }
    getQuest(questid) {
        return this.common.DB.templates.quests[questid];
    }
    getItemLocaleData(itemid, lang) {
        //let itemid = this.getID(item)
        let ItemDataCache = {
            Name: "",
            ShortName: "",
            Description: ""
        };
        if (lang == null) {
            ItemDataCache.Name = this.common.DB.locales.global["ch"][`${itemid} Name`];
            ItemDataCache.ShortName = this.common.DB.locales.global["ch"][`${itemid} ShortName`];
            ItemDataCache.Description = this.common.DB.locales.global["ch"][`${itemid} Description`];
        }
        else {
            ItemDataCache.Name = this.common.DB.locales.global[lang][`${itemid} Name`];
            ItemDataCache.ShortName = this.common.DB.locales.global[lang][`${itemid} ShortName`];
            ItemDataCache.Description = this.common.DB.locales.global[lang][`${itemid} Description`];
        }
        return ItemDataCache;
    }
    getItemName(itemid, lang) {
        if (lang == null) {
            return this.common.DB.locales.global["ch"][`${itemid} Name`];
        }
        else {
            return this.common.DB.locales.global[lang][`${itemid} Name`];
        }
    }
    getItemShortName(itemid, lang) {
        if (lang == null) {
            return this.common.DB.locales.global["ch"][`${itemid} ShortName`];
        }
        else {
            return this.common.DB.locales.global[lang][`${itemid} ShortName`];
        }
    }
    getItemDescription(itemid, lang) {
        if (lang == null) {
            return this.common.DB.locales.global["ch"][`${itemid} Description`];
        }
        else {
            return this.common.DB.locales.global[lang][`${itemid} Description`];
        }
    }
    getQuestName(questid, lang) {
        if (lang == null) {
            return this.common.DB.locales.global["ch"][`${questid} name`];
        }
        else {
            return this.common.DB.locales.global[lang][`${questid} name`];
        }
    }
    getQuestDescription(questid, lang) {
        if (lang == null) {
            return this.common.DB.locales.global["ch"][`${questid} description`];
        }
        else {
            return this.common.DB.locales.global[lang][`${questid} description`];
        }
    }
    getQuestLocaleData(questid, lang) {
        let QuestLocaleCache = {
            Name: "",
            Description: "",
            TraderID: "",
            TraderName: ""
        };
        if (lang == null) {
            QuestLocaleCache.Name = this.common.DB.locales.global["ch"][`${questid} name`];
            QuestLocaleCache.TraderID = this.getQuestTraderID(questid);
            QuestLocaleCache.TraderName = this.common.DB.locales.global["ch"][`${this.getQuestTraderID(questid)} Nickname`];
            QuestLocaleCache.Description = this.common.DB.locales.global["ch"][`${questid} description`];
        }
        else {
            QuestLocaleCache.Name = this.common.DB.locales.global[lang][`${questid} name`];
            QuestLocaleCache.TraderID = this.getQuestTraderID(questid);
            QuestLocaleCache.TraderName = this.common.DB.locales.global[lang][`${this.getQuestTraderID(questid)} Nickname`];
            QuestLocaleCache.Description = this.common.DB.locales.global[lang][`${questid} description`];
        }
        return QuestLocaleCache;
    }
    getID(obj) {
        return obj._id;
    }
    getQuestTraderID(questid) {
        if (this.common.DB.templates.quests[questid] != null)
            return this.common.DB.templates.quests[questid].traderId;
        else
            return null;
    }
    getItemID(obj) {
        return obj._id;
    }
    BuildPriceTab() {
        var CacheTab = {};
        const Handbook = this.common.DB.templates.handbook.Items;
        Handbook.forEach(obj => {
            CacheTab[obj.Id] = obj.Price;
        });
        return CacheTab;
    }
    getItemPrice(PriceTab, itemid, Mode) {
        var TempItem = { "templateId": itemid };
        const Price = this.common.DB.templates.prices;
        if (Mode == true) {
            return this.ragfair.getItemMinAvgMaxFleaPriceValues(TempItem).avg;
        }
        else {
            if (PriceTab[itemid] == null) {
                if (Price[itemid] == null) {
                    return 0;
                }
                else {
                    return Price[itemid];
                }
            }
            else {
                return PriceTab[itemid];
            }
        }
    }
    getItemLevel(PriceTab, itemid, Mode) {
        var CachePrice = this.getItemPrice(PriceTab, itemid, Mode);
        const PriceCfg = this.common.Config.Main.Price;
        if (CachePrice > PriceCfg.PriceLevel0.Min && CachePrice <= PriceCfg.PriceLevel0.Max) {
            return 0;
        }
        else if (CachePrice > PriceCfg.PriceLevel1.Min && CachePrice <= PriceCfg.PriceLevel1.Max) {
            return 1;
        }
        else if (CachePrice > PriceCfg.PriceLevel2.Min && CachePrice <= PriceCfg.PriceLevel2.Max) {
            return 2;
        }
        else if (CachePrice > PriceCfg.PriceLevel3.Min && CachePrice <= PriceCfg.PriceLevel3.Max) {
            return 3;
        }
        else if (CachePrice > PriceCfg.PriceLevel4.Min && CachePrice <= PriceCfg.PriceLevel4.Max) {
            return 4;
        }
        else if (CachePrice > PriceCfg.PriceLevel5.Min && CachePrice <= PriceCfg.PriceLevel5.Max) {
            return 5;
        }
        else if (CachePrice > PriceCfg.PriceLevel6.Min && CachePrice <= PriceCfg.PriceLevel6.Max) {
            return 6;
        }
        else if (CachePrice > PriceCfg.PriceLevel7.Min) {
            return 7;
        }
        else
            return 1;
    }
    readItemLocleCache() {
        return this.json.deserialize(this.vfs.readFile(`${this.common.ModPath}Cache/ItemLocaleKeyCache.json`));
    }
    readQuestLocleCache() {
        return this.json.deserialize(this.vfs.readFile(`${this.common.ModPath}Cache/QuestLocaleKeyCache.json`));
    }
    readTraderCache() {
        return this.json.deserialize(this.vfs.readFile(`${this.common.ModPath}Cache/TraderCache.json`));
    }
    readItemPriceCache() {
        return this.json.deserialize(this.vfs.readFile(`${this.common.ModPath}Cache/ItemPriceCache.json`));
    }
    readQuestDataCache() {
        return this.json.deserialize(this.vfs.readFile(`${this.common.ModPath}Cache/QuestDataCache.json`));
    }
    setItemData(PriceTab) {
        const Lang = this.common.DB.locales.global.ch;
        const Cache = this.readItemLocleCache();
        const Config = this.common.Config;
        const PriceTabcache = this.readItemPriceCache();
        const QuestDataCache = this.readQuestDataCache();
        const start = performance.now();
        this.common.Log("正在初始化物品数据…");
        const Count = this.common.countKeys(Cache);
        for (let Obj in Cache) {
            var CacheID = Cache[Obj].ID;
            var CachePrice = this.getItemPrice(PriceTab, CacheID, Config.Main.Display.RagfairMode);
            var CacheSinglePrice = Math.floor(CachePrice / this.getItemSize(CacheID));
            var CacheLevel = this.getItemLevel(PriceTab, CacheID, Config.Main.Display.RagfairMode);
            var CacheAmmo = this.getAmmoData(CacheID);
            var CacheArmor = this.getArmorData(CacheID);
            var CacheName = Cache[Obj].Name;
            var CacheNameS = Cache[Obj].ShortName;
            var CacheDesc = Cache[Obj].Description;
            var SellString = "";
            var PriceString = "";
            var AmmoString = "";
            var ArmorString = "";
            var ArmorString2 = "";
            var QuestString = "";
            const PriceMap = PriceTabcache[CacheID];
            if (Config.Main.Display.Price == true) {
                PriceString = this.setTextColor(`参考价值: ${CachePrice}    参考单格价值: ${CacheSinglePrice}\n`, Config.Main.Color.PriceColor, 20);
            }
            if (Config.Main.Display.PriceSuggest == true) {
                SellString = this.setTextColor(`此物品建议出售给${PriceMap.Price.tradername}  预期收益${PriceMap.Price.price}卢布\n`, Config.Main.Color.PriceColor, 20);
            }
            if (Config.Main.Display.Ammo == true) {
                this.setAmmoColor(CacheID);
                if (CacheAmmo != null) {
                    AmmoString = this.setTextColor(`穿深: ${CacheAmmo.Pent}    肉伤: ${CacheAmmo.Damage}    甲伤: ${CacheAmmo.ArmorDamage}    弹丸: ${CacheAmmo.BulletCount}\n`, Config.Main.Color.AmmoColor, 20);
                }
            }
            if (Config.Main.Display.Armor == true) {
                if (CacheArmor != null) {
                    ArmorString = this.setTextColor(`钝伤系数: ${CacheArmor.Blunt}\n`, Config.Main.Color.ArmorColor, 20);
                    ArmorString2 = this.setTextColor(`维修损耗: ${CacheArmor.MinRepairCount} - ${CacheArmor.MaxRepairCount}    套件维修损耗: ${CacheArmor.MinRepairKitCount} - ${CacheArmor.MaxRepairKitCount}\n`, Config.Main.Color.ArmorColor, 20);
                }
            }
            if (Config.Main.Display.Item == true) {
                if (QuestDataCache.Item[CacheID] != null && ((!this.isQuestItem(CacheID)) == true) && ((!this.inBlackList(CacheID, Config.Main.ItemBlackList)) == true)) {
                    //if ((!this.isQuestItem(CacheID))==true) {
                    //if (!this.inBlackList(CacheID, Config.Main.BlackList)==true) {
                    for (var i = 0; i < QuestDataCache.Item[CacheID].QuestList.length; i++) {
                        const cachedata = QuestDataCache.Item[CacheID].QuestList[i];
                        switch (cachedata.types) {
                            case "Handover":
                                {
                                    switch (cachedata.onlyfindinraid) {
                                        case true:
                                            {
                                                QuestString += this.setTextColor2(`${cachedata.questtradername}的任务「${cachedata.questname}」需要上交${cachedata.count}个在战局中找到的此物品，`, Config.Main.Color.HandoverRaidColor, 16);
                                            }
                                            break;
                                        case false:
                                            {
                                                QuestString += this.setTextColor2(`${cachedata.questtradername}的任务「${cachedata.questname}」需要交付${cachedata.count}个此物品，`, Config.Main.Color.HandoverColor, 16);
                                            }
                                            break;
                                    }
                                }
                                break;
                            case "Leave":
                                {
                                    QuestString += this.setTextColor2(`${cachedata.questtradername}的任务「${cachedata.questname}」需要在指定地点安放${cachedata.count}个此物品，`, Config.Main.Color.LeaveColor, 16);
                                }
                                break;
                        }
                    }
                    //}
                    //}
                }
            }
            if (QuestString !== "") {
                QuestString = QuestString.slice(0, -20) + "。</b></size></color>\n";
            }
            Lang[`${CacheID} Description`] = "";
            if (Config.Main.Display.Item == true) {
                Lang[`${CacheID} Name`] = "";
                Lang[`${CacheID} ShortName`] = "";
                Lang[`${CacheID} Name`] = `<color=#${this.LevelMap[CacheLevel]}>${this.TagMap[CacheLevel]}${CacheName}</color>`;
                if (Config.Main.Display.ShortNamePriceMode == true) {
                    Lang[`${CacheID} ShortName`] = `<color=#${this.LevelMap[CacheLevel]}>${this.convertNum(CachePrice)}</color>`;
                }
                else {
                    Lang[`${CacheID} ShortName`] = `<color=#${this.LevelMap[CacheLevel]}>${CacheNameS}</color>`;
                }
            }
            Lang[`${CacheID} Description`] = `${ArmorString}${ArmorString2}${AmmoString}${PriceString}${SellString}${QuestString}${CacheDesc}`;
        }
        const end = performance.now();
        this.common.Log(`物品数据初始化完成，共发现${Count}个物品，耗时${this.common.formatTime(end - start)}`);
    }
    setQuestData() {
        const Lang = this.common.DB.locales.global.ch;
        const Cache = this.readQuestLocleCache();
        const Config = this.common.Config;
        const QuestDataCache = this.readQuestDataCache();
        const start = performance.now();
        this.common.Log("正在初始化任务数据…");
        const Count = this.common.countKeys(Cache);
        for (let Obj in Cache) {
            var CacheID = Cache[Obj].ID;
            var CacheName = Cache[Obj].Name;
            var CacheDesc = Cache[Obj].Description;
            var PreQuest = "";
            var PreQuestString = "";
            var UnlockQuest = "";
            var UnlockQuestString = "";
            var QuestLevel = "";
            var MainString = "";
            Lang[`${CacheID} description`] = "";
            if (QuestDataCache.Quest[CacheID] != null) {
                const QDC = QuestDataCache.Quest[CacheID].Start;
                if (Config.Main.Display.Quest == true) {
                    if (Config.Main.Display.MainQuest == true) {
                        Lang[`${CacheID} name`] = "";
                        if (this.isMainQuest(CacheID) == true) {
                            Lang[`${CacheID} name`] = `<color=#${Config.Main.Color.MainQuestColor}><b>${Config.Main.Tag.MainQuestTag}${CacheName}</b></color>`;
                        }
                        else {
                            Lang[`${CacheID} name`] = `${CacheName}`;
                        }
                    }
                }
                if (QDC.Level > 0) {
                    QuestLevel = this.setQuestTextColor(`等级需求: PMC等级达到${QDC.Level}级。\n`, Config.Main.Color.QuestLevelColor);
                }
                if (QDC.PreQuest.length > 0) {
                    PreQuest += `前置任务: 完成`;
                    for (var i = 0; i < QDC.PreQuest.length; i++) {
                        PreQuestString += `「${QDC.PreQuest[i].questname}」(${QDC.PreQuest[i].questtradername})、`;
                    }
                    PreQuestString = PreQuestString.slice(0, -1) + `，`;
                }
                PreQuest = this.setQuestTextColor(PreQuest + PreQuestString, Config.Main.Color.PreQuestColor);
                if (QDC.UnlockQuest.length > 0) {
                    UnlockQuest += `后续任务: `;
                    for (var i = 0; i < QDC.UnlockQuest.length; i++) {
                        UnlockQuestString += `「${QDC.UnlockQuest[i].questname}」(${QDC.UnlockQuest[i].questtradername})、`;
                    }
                    UnlockQuestString = UnlockQuestString.slice(0, -1) + `，`;
                }
                UnlockQuest = this.setQuestTextColor(UnlockQuest + UnlockQuestString, Config.Main.Color.UnlockQuestColor);
                MainString = `${PreQuest}${UnlockQuest}${QuestLevel}`;
                if (!(this.inBlackList(CacheID, Config.Main.QuestBlackList))) {
                    Lang[`${CacheID} description`] = `${MainString}${CacheDesc}`;
                }
                else {
                    Lang[`${CacheID} description`] = `${CacheDesc}`;
                }
            }
        }
        const end = performance.now();
        this.common.Log(`任务数据初始化完成，共发现${Count}个任务，耗时${this.common.formatTime(end - start)}`);
    }
    convertNum(num) {
        if (num < 1000) {
            return num.toString();
        }
        const units = ["K", "M", "G", "T", "P", "E"]; // 可扩展到更大的单位
        let count = num;
        let unitIndex = 0;
        while (count >= 1000 && unitIndex < units.length) {
            count /= 1000;
            unitIndex++;
        }
        return count.toFixed(1) + units[unitIndex - 1];
    }
    getItemRagfair(itemid) {
        return this.common.DB.templates.items[itemid]._props.CanSellOnRagfair;
    }
    isItemAccepted(itemid, TagID) {
        if (!this.getItem(itemid)) {
            return false; // 物品不存在
        }
        const item = this.getItem(itemid);
        if (item._parent === TagID) {
            return true; // 商人直接接受该物品类标签
        }
        if (!item._parent) {
            return false; // 物品没有父级
        }
        return this.isItemAccepted(item._parent, TagID);
    }
    isTraderAccepted(itemid, TagArr) {
        for (let i = 0; i < TagArr.length; i++) {
            const tagid = TagArr[i];
            if (this.isItemAccepted(itemid, tagid)) {
                return true; // 只要有一个TagID能接受该物品，返回true
            }
        }
        return false; // 未找到接受该物品的TagID
    }
    getTraderName(traderid) {
        if (this.common.DB.locales.global.ch[`${traderid} Nickname`] != null) {
            return this.common.DB.locales.global.ch[`${traderid} Nickname`];
        }
        else
            return "NoName";
    }
    getPriceMap(itemid, PriceTab) {
        const Cache = this.readTraderCache();
        const CacheMap = {};
        const itemPrice = this.getItemPrice(PriceTab, itemid, false);
        const isItemAcceptedMap = {};
        // 预先计算所有物品是否被商人接受的结果
        for (let td in Cache) {
            const tid = Cache[td].ID;
            const count = Cache[td].count;
            const category = Cache[td].Category;
            isItemAcceptedMap[tid] = this.isTraderAccepted(itemid, category);
            CacheMap[tid] = 0;
            if (category.length > 0 && isItemAcceptedMap[tid]) {
                CacheMap[tid] = Math.ceil(itemPrice * count);
            }
        }
        // 计算 Ragfair 的值
        const TempItem = { "templateId": itemid };
        //CacheMap["Ragfair"] = Math.ceil(this.ragfair.getItemMinAvgMaxFleaPriceValues(TempItem).avg);
        return this.getMaxKeyValue(CacheMap);
    }
    getMaxKeyValue(obj) {
        const arr = Object.entries(obj);
        arr.sort((a, b) => b[1] - a[1]); // 根据值进行降序排序
        const maxKey = arr[0][0];
        const maxValue = arr[0][1];
        return { traderid: maxKey, tradername: this.getTraderName(maxKey), price: maxValue };
    }
    setTextColor(string, Color, size) {
        return `<color=#${Color}><size=${size}><align=center><b>${string}</b></align></size></color>`;
    }
    getItemSize(itemid) {
        return (this.getItem(itemid)._props.Width * this.getItem(itemid)._props.Height);
    }
    isAmmo(itemid) {
        if (this.getItem(itemid)._parent == "5485a8684bdc2da71d8b4567") {
            return true;
        }
        else
            return false;
    }
    getAmmoData(itemid) {
        const Item = this.getItem(itemid);
        if (this.isAmmo(itemid)) {
            return {
                Pent: Item._props.PenetrationPower,
                Damage: Item._props.Damage,
                ArmorDamage: Item._props.ArmorDamage,
                BulletCount: Item._props.ProjectileCount
            };
        }
        else {
            return null;
        }
    }
    setAmmoColor(itemid) {
        const item = this.common.DB.templates.items[itemid];
        if (this.isAmmo(itemid)) {
            const Pent = this.getAmmoData(itemid).Pent;
            if (Pent >= 60) {
                item._props.BackgroundColor = "red";
            }
            else if (Pent >= 50) {
                item._props.BackgroundColor = "yellow";
            }
            else if (Pent >= 40) {
                item._props.BackgroundColor = "violet";
            }
            else if (Pent >= 30) {
                item._props.BackgroundColor = "blue";
            }
            else if (Pent >= 20) {
                item._props.BackgroundColor = "green";
            }
            else {
                item._props.BackgroundColor = "default";
            }
        }
    }
    isArmor(itemid) {
        if (this.getItem(itemid)._parent == "5448e54d4bdc2dcc718b4568") {
            return true;
        }
        else if (this.getItem(itemid)._parent == "5448e5284bdc2dcb718b4567") {
            if (this.getItem(itemid)._props.armorClass != null && this.getItem(itemid)._props.armorClass > 0) {
                return true;
            }
        }
        else {
            if (this.getItem(itemid)._props.armorClass != null && this.getItem(itemid)._props.armorClass > 0) {
                return true;
            }
            else
                return false;
        }
    }
    getArmorData(itemid) {
        const Item = this.getItem(itemid);
        const ArmorType = this.common.DB.globals.config.ArmorMaterials;
        if (this.isArmor(itemid)) {
            try {
                return {
                    Blunt: `${(Item._props.BluntThroughput * 100).toFixed(2)}%`,
                    MinRepairCount: `${(ArmorType[Item._props.ArmorMaterial].MinRepairDegradation * 100).toFixed(2)}%`,
                    MaxRepairCount: `${(ArmorType[Item._props.ArmorMaterial].MaxRepairDegradation * 100).toFixed(2)}%`,
                    MinRepairKitCount: `${(ArmorType[Item._props.ArmorMaterial].MinRepairKitDegradation * 100).toFixed(2)}%`,
                    MaxRepairKitCount: `${(ArmorType[Item._props.ArmorMaterial].MaxRepairKitDegradation * 100).toFixed(2)}%`
                };
            }
            catch (err) {
                this.common.Error(`警告！护甲数据读取失败，可能导致该错误的物品为${this.getItemName(itemid, "ch")}(${itemid})`);
            }
        }
        else {
            return null;
        }
    }
    getQuestStartData(questid) {
        const StartArr = this.getQuest(questid).conditions.AvailableForStart;
        var Cache = {};
        Cache["Level"] = 0;
        Cache["QuestList"] = [];
        if (StartArr.length > 0) {
            for (var i = 0; i < StartArr.length; i++) {
                if (StartArr[i]._parent == "Level") {
                    Cache["Level"] = StartArr[i]._props.value;
                }
                if (StartArr[i]._parent == "Quest" && StartArr[i]._props.status[0] == 4) {
                    Cache["QuestList"].push({
                        questid: StartArr[i]._props.target,
                        questname: this.getQuestName(String(StartArr[i]._props.target), "ch"),
                        questtraderid: this.getQuestTraderID(String(StartArr[i]._props.target)),
                        questtradername: this.getTraderName(this.getQuestTraderID(String(StartArr[i]._props.target)))
                    });
                }
            }
        }
        return Cache;
    }
    isQuestItem(itemid) {
        if (this.getItem(itemid) != null) {
            return this.getItem(itemid)._props.QuestItem;
        }
    }
    getQuestFinishData(questid) {
        const FinishArr = this.getQuest(questid).conditions.AvailableForFinish;
        var Cache = {};
        Cache["Handover"] = [];
        Cache["Leave"] = [];
        if (FinishArr.length > 0) {
            for (var i = 0; i < FinishArr.length; i++) {
                if (FinishArr[i]._parent == "HandoverItem") {
                    Cache["Handover"].push({
                        itemid: FinishArr[i]._props.target[0],
                        itemname: this.getItemName(FinishArr[i]._props.target[0], "ch"),
                        questitem: this.isQuestItem(FinishArr[i]._props.target[0]),
                        onlyfindinraid: FinishArr[i]._props.onlyFoundInRaid,
                        count: FinishArr[i]._props.value
                    });
                }
                if (FinishArr[i]._parent == "LeaveItemAtLocation") {
                    Cache["Leave"].push({
                        itemid: FinishArr[i]._props.target[0],
                        itemname: this.getItemName(FinishArr[i]._props.target[0], "ch"),
                        questitem: this.isQuestItem(FinishArr[i]._props.target[0]),
                        onlyfindinraid: FinishArr[i]._props.onlyFoundInRaid,
                        count: FinishArr[i]._props.value
                    });
                }
            }
        }
        return Cache;
    }
    inBlackList(itemid, blacklist) {
        if (blacklist.includes(itemid))
            return true;
        else
            return false;
    }
    setTextColor2(string, Color, size) {
        return `<color=#${Color}><size=${size}><b>${string}</b></size></color>`;
    }
    setQuestTextColor(string, Color) {
        return `<color=#${Color}><b>${string}</b></color>`;
    }
    isMainQuest(questid) {
        const QuestDataCache = this.readQuestDataCache();
        const QuestArray = QuestDataCache.Quest[questid].Start.UnlockQuest;
        return QuestArray.some(quest => quest.questid == "5c51aac186f77432ea65c552");
    }
    addAssort(itemid) {
        const AssortData1 = this.common.DB.traders["54cb57776803fa99248b456e"].assort;
        //if (this.common.Config.Main.DebugMode == true) {
        AssortData1.items.push({
            "_id": itemid,
            "_tpl": itemid,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "StackObjectsCount": 99999,
                "UnlimitedCount": true
            }
        });
        AssortData1.barter_scheme[itemid] = [[{
                    count: 1,
                    _tpl: '5449016a4bdc2d6f028b456f'
                }]];
        AssortData1.loyal_level_items[itemid] = 1;
        //}
    }
    addItem() {
        for (let it in this.common.ModDB.items) {
            this.common.DB.templates.items[it] = this.common.ModDB.items[it];
            this.common.DB.locales.global["ch"][`${this.common.ModDB.items[it]._id} Name`] = this.common.ModDB.items[it]._props.Name;
            this.common.DB.locales.global["ch"][`${this.common.ModDB.items[it]._id} ShortName`] = this.common.ModDB.items[it]._props.ShortName;
            this.common.DB.locales.global["ch"][`${this.common.ModDB.items[it]._id} Description`] = this.common.ModDB.items[it]._props.Description;
        }
    }
    addSpawn() {
        const Forced = this.common.ModDB.itemspawn.Forced;
        const DB = this.common.DB.locations;
        DB.tarkovstreets.looseLoot.spawnpointsForced.push(Forced[0]);
        DB.tarkovstreets.looseLoot.spawnpointsForced.push(Forced[1]);
    }
    addQuest() {
        for (let qt in this.common.ModDB.achievement) {
            const Quest = this.common.ModDB.achievement[qt];
            if (Quest.check == true) {
                if (this.common.checkTrader(Quest.checkid) == true) {
                    if (this.common.DB.traders["Persicaria"] != null) {
                        Quest.traderId = "Persicaria";
                    }
                    this.common.DB.templates.quests[qt] = Quest;
                }
            }
            else {
                if (this.common.DB.traders["Persicaria"] != null) {
                    Quest.traderId = "Persicaria";
                }
                this.common.DB.templates.quests[qt] = Quest;
            }
        }
    }
};
Data = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("ImporterUtil")),
    __param(2, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(3, (0, tsyringe_1.inject)("RagfairController")),
    __param(4, (0, tsyringe_1.inject)("JsonUtil")),
    __param(5, (0, tsyringe_1.inject)("VFS")),
    __param(6, (0, tsyringe_1.inject)("Common")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof ImporterUtil_1.ImporterUtil !== "undefined" && ImporterUtil_1.ImporterUtil) === "function" ? _b : Object, typeof (_c = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _c : Object, typeof (_d = typeof RagfairController_1.RagfairController !== "undefined" && RagfairController_1.RagfairController) === "function" ? _d : Object, typeof (_e = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _e : Object, typeof (_f = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _f : Object, typeof (_g = typeof Common_1.Common !== "undefined" && Common_1.Common) === "function" ? _g : Object])
], Data);
exports.Data = Data;
