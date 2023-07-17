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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const VFS_1 = require("C:/snapshot/project/obj/utils/VFS");
const Data_1 = require("./Data");
const Common_1 = require("./Common");
let Cache = class Cache {
    constructor(vfs, data, common) {
        this.vfs = vfs;
        this.data = data;
        this.common = common;
    }
    writeItemLocaleKeyCache() {
        let ItemLocaleKeyCache = {};
        const start = performance.now();
        this.common.Log("正在为物品建立本地化索引…");
        const Count = this.common.countKeys(this.common.DB.templates.items);
        for (let it in this.common.DB.templates.items) {
            let cacheid = this.data.getItemID(this.common.DB.templates.items[it]);
            let itemid = this.data.getItemID(this.common.DB.templates.items[it]);
            if (this.data.getItemName(itemid, "ch") != null) {
                ItemLocaleKeyCache[cacheid] = {};
                ItemLocaleKeyCache[cacheid].ID = itemid;
                ItemLocaleKeyCache[cacheid].Name = this.data.getItemLocaleData(itemid, "ch").Name;
                ItemLocaleKeyCache[cacheid].ShortName = this.data.getItemLocaleData(itemid, "ch").ShortName;
                ItemLocaleKeyCache[cacheid].Description = this.data.getItemLocaleData(itemid, "ch").Description;
                //ItemLocaleKeyCache[cacheid].ParentID
            }
        }
        this.vfs.writeFile(`${this.common.ModPath}Cache/ItemLocaleKeyCache.json`, JSON.stringify(ItemLocaleKeyCache, null, 4));
        const end = performance.now();
        this.common.Log(`物品本地化索引构建完成，共发现${Count}个物品，耗时${this.common.formatTime(end - start)}`);
        //this.common.Debug("")
    }
    writeQuestLocaleKeyCache() {
        let QuestLocaleKeyCache = {};
        const start = performance.now();
        this.common.Log("正在为任务建立本地化索引…");
        const Count = this.common.countKeys(this.common.DB.templates.quests);
        for (let qt in this.common.DB.templates.quests) {
            let questid = this.data.getID(this.common.DB.templates.quests[qt]);
            QuestLocaleKeyCache[questid] = {};
            QuestLocaleKeyCache[questid].ID = questid;
            QuestLocaleKeyCache[questid].Name = this.data.getQuestLocaleData(questid, "ch").Name;
            QuestLocaleKeyCache[questid].Description = this.data.getQuestLocaleData(questid, "ch").Description;
            QuestLocaleKeyCache[questid].TraderID = this.data.getQuestLocaleData(questid, "ch").TraderID;
            QuestLocaleKeyCache[questid].TraderName = this.data.getQuestLocaleData(questid, "ch").TraderName;
        }
        this.vfs.writeFile(`${this.common.ModPath}Cache/QuestLocaleKeyCache.json`, JSON.stringify(QuestLocaleKeyCache, null, 4));
        const end = performance.now();
        this.common.Log(`任务本地化索引构建完成，共发现${Count}个任务，耗时${this.common.formatTime(end - start)}`);
    }
    writeTraderCache() {
        let TraderCache = {};
        const start = performance.now();
        this.common.Log("正在为所有商人建立索引…");
        const Count = this.common.countKeys(this.common.DB.traders);
        for (let td in this.common.DB.traders) {
            const traderid = this.common.DB.traders[td].base._id;
            const Trader = this.common.DB.traders[td].base;
            //const arr = this.common.DB.traders[td].base.items_buy.category
            try {
                if (Trader.items_buy != null) {
                    const values = Object.values(Trader.items_buy);
                    const arr = values[0];
                    TraderCache[traderid] = {};
                    TraderCache[traderid].ID = traderid;
                    TraderCache[traderid].Name = this.data.getTraderName(traderid);
                    TraderCache[traderid].count = (100 - Trader.loyaltyLevels[0].buy_price_coef) / 100;
                    TraderCache[traderid].Category = arr;
                }
            }
            catch (err) {
                this.common.Error(`警告，索引建立失败，可能导致错误的商人为${this.data.getTraderName(traderid)}(${traderid})`);
            }
        }
        this.vfs.writeFile(`${this.common.ModPath}Cache/TraderCache.json`, JSON.stringify(TraderCache, null, 4));
        const end = performance.now();
        this.common.Log(`商人索引构建完成，共发现${Count}个商人，耗时${this.common.formatTime(end - start)}`);
    }
    writeItemPriceCache(PriceTab) {
        let ItemPricecache = {};
        const Keycache = this.data.readItemLocleCache();
        const start = performance.now();
        this.common.Log("正在为物品计算最优解…");
        const Count = this.common.countKeys(Keycache);
        for (let key in Keycache) {
            const cacheid = Keycache[key].ID;
            ItemPricecache[cacheid] = {};
            ItemPricecache[cacheid].ID = cacheid;
            ItemPricecache[cacheid].Name = this.data.getItemName(cacheid, "ch");
            ItemPricecache[cacheid].Price = this.data.getPriceMap(cacheid, PriceTab);
        }
        this.vfs.writeFile(`${this.common.ModPath}Cache/ItemPriceCache.json`, JSON.stringify(ItemPricecache, null, 4));
        const end = performance.now();
        this.common.Log(`物品最优解计算完毕，共发现${Count}个物品，耗时${this.common.formatTime(end - start)}`);
    }
    writrQuestDataCache() {
        const Quest = this.common.DB.templates.quests;
        const start = performance.now();
        this.common.Log("正在构建任务数据…");
        const Count = this.common.countKeys(Quest);
        var QuestData = {
            Quest: {},
            Item: {}
        };
        const quest = QuestData.Quest;
        const Item = QuestData.Item;
        for (let qt in Quest) {
            const QT = Quest[qt];
            const QID = Quest[qt]._id;
            const QLocale = this.data.getQuestLocaleData(QID, "ch");
            const QStart = this.data.getQuestStartData(QID);
            const QFinish = this.data.getQuestFinishData(QID);
            quest[QID] = {};
            quest[QID].ID = "";
            quest[QID].Name = "";
            quest[QID].Description = "";
            quest[QID].TraderID = "";
            quest[QID].TraderName = "";
            quest[QID].Start = {
                Level: 0,
                PreQuest: [],
                UnlockQuest: []
            };
            quest[QID].Finish = {
                Handover: [],
                Leave: []
            };
            if (QFinish["Handover"].length > 0) {
                try {
                    for (var i = 0; i < QFinish["Handover"].length; i++) {
                        const it = Item[QFinish["Handover"][i].itemid];
                        if (Item[QFinish["Handover"][i].itemid] == null) {
                            Item[QFinish["Handover"][i].itemid] = {};
                            Item[QFinish["Handover"][i].itemid].ID = QFinish["Handover"][i].itemid;
                            Item[QFinish["Handover"][i].itemid].Name = QFinish["Handover"][i].itemname;
                            Item[QFinish["Handover"][i].itemid].QuestItem = QFinish["Handover"][i].questitem;
                            Item[QFinish["Handover"][i].itemid].QuestList = [];
                            Item[QFinish["Handover"][i].itemid].QuestList.push({
                                questid: QID,
                                questname: QLocale.Name,
                                questtraderid: QLocale.TraderID,
                                questtradername: QLocale.TraderName,
                                onlyfindinraid: QFinish["Handover"][i].onlyfindinraid,
                                count: QFinish["Handover"][i].count,
                                types: "Handover"
                            });
                        }
                        else {
                            Item[QFinish["Handover"][i].itemid].QuestList.push({
                                questid: QID,
                                questname: QLocale.Name,
                                questtraderid: QLocale.TraderID,
                                questtradername: QLocale.TraderName,
                                onlyfindinraid: QFinish["Handover"][i].onlyfindinraid,
                                count: QFinish["Handover"][i].count,
                                types: "Handover"
                            });
                        }
                    }
                }
                catch (err) {
                    this.common.Error(err);
                    this.common.Error(`警告！写入数据时发生错误！可能导致错误的ID为${QID}(${QLocale.Name})`);
                    this.common.Error(`尝试对错误位置进行捕获：${JSON.stringify(QFinish["Handover"], null, 4)}`);
                }
            }
            if (QFinish["Leave"].length > 0) {
                for (var i = 0; i < QFinish["Leave"].length; i++) {
                    if (Item[QFinish["Leave"][i].itemid] == null) {
                        Item[QFinish["Leave"][i].itemid] = {};
                        Item[QFinish["Leave"][i].itemid].ID = QFinish["Leave"][i].itemid;
                        Item[QFinish["Leave"][i].itemid].Name = QFinish["Leave"][i].itemname;
                        Item[QFinish["Leave"][i].itemid].QuestItem = QFinish["Leave"][i].questitem;
                        Item[QFinish["Leave"][i].itemid].QuestList = [];
                        Item[QFinish["Leave"][i].itemid].QuestList.push({
                            questid: QID,
                            questname: QLocale.Name,
                            questtraderid: QLocale.TraderID,
                            questtradername: QLocale.TraderName,
                            onlyfindinraid: QFinish["Leave"][i].onlyfindinraid,
                            count: QFinish["Leave"][i].count,
                            types: "Leave"
                        });
                    }
                    else {
                        Item[QFinish["Leave"][i].itemid].QuestList.push({
                            questid: QID,
                            questname: QLocale.Name,
                            questtraderid: QLocale.TraderID,
                            questtradername: QLocale.TraderName,
                            onlyfindinraid: QFinish["Leave"][i].onlyfindinraid,
                            count: QFinish["Leave"][i].count,
                            types: "Leave"
                        });
                    }
                }
            }
        }
        for (let qt in Quest) {
            const QT = Quest[qt];
            const QID = Quest[qt]._id;
            const QLocale = this.data.getQuestLocaleData(QID, "ch");
            const QStart = this.data.getQuestStartData(QID);
            const QFinish = this.data.getQuestFinishData(QID);
            quest[QID].ID = QID;
            quest[QID].Name = QLocale.Name;
            quest[QID].Description = QLocale.Description;
            quest[QID].TraderID = QLocale.TraderID;
            quest[QID].TraderName = QLocale.TraderName;
            quest[QID].Start.Level = QStart["Level"];
            quest[QID].Start.PreQuest = QStart["QuestList"];
            quest[QID].Finish = {
                Handover: QFinish["Handover"],
                Leave: QFinish["Leave"]
            };
            if ((QStart["QuestList"].length > 0)) {
                for (var i = 0; i < QStart["QuestList"].length; i++) {
                    if (quest[QStart["QuestList"][i].questid] != null) {
                        quest[QStart["QuestList"][i].questid].Start.UnlockQuest.push({
                            questid: quest[QID].ID,
                            questname: quest[QID].Name,
                            questtraderid: quest[QID].TraderID,
                            questtradername: quest[QID].TraderName
                        });
                    }
                }
            }
        }
        this.vfs.writeFile(`${this.common.ModPath}Cache/QuestDataCache.json`, JSON.stringify(QuestData, null, 4));
        const end = performance.now();
        this.common.Log(`任务数据构建完成，共发现${Count}个任务，耗时${this.common.formatTime(end - start)}`);
    }
};
Cache = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("VFS")),
    __param(1, (0, tsyringe_1.inject)("Data")),
    __param(2, (0, tsyringe_1.inject)("Common")),
    __metadata("design:paramtypes", [typeof (_a = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _a : Object, typeof (_b = typeof Data_1.Data !== "undefined" && Data_1.Data) === "function" ? _b : Object, typeof (_c = typeof Common_1.Common !== "undefined" && Common_1.Common) === "function" ? _c : Object])
], Cache);
exports.Cache = Cache;
