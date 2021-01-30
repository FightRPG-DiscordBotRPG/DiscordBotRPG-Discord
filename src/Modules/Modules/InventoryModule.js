const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const ItemShow = require("../../Drawings/ItemShow");
const Inventory = require("../../Drawings/Inventory");
const Emojis = require("../../Drawings/Emojis");
const Discord = require("discord.js");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");


class InventoryModule extends GModule {
    constructor() {
        super();
        this.commands = ["item", "itemfav", "itemunfav", "inv", "inventory", "sell", "sellall", "sendmoney"];
        this.startLoading("Inventory");
        this.init();
        this.endLoading("Inventory");
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} command
     * @param {Array} args
     */
    async run(message, command, args) {
        let msg = "";
        let mentions = message.mentions.users;
        let firstMention;
        let user = Globals.connectedUsers[message.author.id];
        let axios = user.getAxios();
        let searchFilters;

        switch (command) {
            case "item":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/inventory/item/" + args[0]), async (data) => {
                    let itemmsg;
                    if (data.equippedStats != null) {
                        itemmsg = ItemShow.showItem(data, user);
                    } else {
                        itemmsg = ItemShow.showItem(data, user, true);
                    }

                    let isEquipped = (isNaN(parseInt(args[0])) && args[0] !== "last");
                    let sellEmoji = Emojis.general.money_bag;
                    let equipUnequipEmoji = isEquipped ? Emojis.general.backpack : Emojis.general.shield;
                    let favoEmoji = data.item.isFavorite == false ? Emojis.general.star : Emojis.general.eight_pointed_black_star;
                    let addToTradeEmoji = Emojis.general.baggage_claim;

                    // See if he is trading
                    let isTrading = await axios.get("/game/character/isTrading");
                    isTrading = isTrading.data;
                    isTrading = isTrading.error == null ? isTrading.isTrading : false;

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(message, itemmsg, {
                        reactionsEmojis: [
                            data.item.isFavorite == true ? null : (isEquipped ? null : sellEmoji),
                            favoEmoji,
                            data.item.equipable == true ? equipUnequipEmoji : null,
                            isTrading == true ? addToTradeEmoji : null
                        ],
                        collectorOptions: {
                            time: 22000,
                            max: 3,
                        }
                    });

                    reactWrapper.collector.on('collect', async (reaction) => {
                        let dataCollector = null;
                        let msgCollector = null;

                        switch (reaction.emoji.name) {
                            case equipUnequipEmoji:
                                if (isEquipped) {
                                    dataCollector = await axios.post("/game/equipment/unequip", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                } else {
                                    dataCollector = await axios.post("/game/equipment/equip", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                }
                                break;
                            case sellEmoji:
                                dataCollector = await axios.post("/game/inventory/sell", {
                                    idItem: data.item.id,
                                    number: 1,
                                    isRealID: true,
                                });
                                break;

                            case favoEmoji:
                                if (data.item.isFavorite == false) {
                                    dataCollector = await axios.post("/game/inventory/itemfav", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                } else {
                                    dataCollector = await axios.post("/game/inventory/itemunfav", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                }
                                break;
                            case addToTradeEmoji:
                                if (this.allModulesReference["TradeModule"] != null) {
                                    this.allModulesReference["TradeModule"].run(message, "tadd", [data.idInInventory, data.item.number]);
                                }
                                break;
                        }

                        if (dataCollector != null) {
                            msgCollector = this.getBasicSuccessErrorMessage(dataCollector);
                            await this.sendMessage(message, msgCollector);
                        }
                    });
                });
                break;

            case "itemfav":
            case "itemunfav": {
                searchFilters = this.getSearchFilters(args);
                let body = {};
                if (Object.values(searchFilters.params).length > 0) {
                    body = searchFilters.params
                    body.filter = true;
                } else {
                    body = { idItem: args[0] }
                }
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/inventory/" + command, body));
            }
                break;

            case "inv":
            case "inventory":
                searchFilters = this.getSearchFilters(args);
                msg = await this.getDisplayIfSuccess(await axios.get("/game/inventory/show/" + searchFilters.page, {
                    params: searchFilters.params
                }), async (data) => {
                    await this.pageListener(data, message, Inventory.displayAsList(data, true), async (currPage) => {
                        let d = await axios.get("/game/inventory/show/" + currPage, {
                            params: searchFilters.params
                        });
                        return d.data;
                    }, async (newData) => {
                        return Inventory.displayAsList(newData, true)
                    });
                });
                break;

            case "sell":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/inventory/sell", {
                    idItem: args[0],
                    number: args[1],
                }));
                break;

            case "sellall":
                searchFilters = this.getSearchFilters(args);

                msg = await this.getDisplayIfSuccess(await axios.post("/game/inventory/sellall/value", searchFilters.params), async (data) => {
                    if (data.value > 0) {
                        this.confirmListener(message, Inventory.ciValueSellAllDisplay(data, searchFilters.params), async (validate) => {
                            if (validate) {
                                return this.getBasicSuccessErrorMessage(await axios.post("/game/inventory/sellall", searchFilters.params));
                            } else {
                                return Translator.getString(data.lang, "inventory_equipment", "sellall_cancel");
                            }
                        });
                    } else {
                        return Translator.getString(data.lang, "errors", "economic_cant_sell_nothing");
                    }
                });
                break;

            case "sendmoney":
                firstMention = mentions.first();
                var isMention = false;
                if (firstMention) {
                    args[0] = firstMention.id;
                    isMention = true;
                }
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/inventory/sendmoney", {
                    id: args[0],
                    isMention: isMention,
                    amount: args[1]
                }));
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = InventoryModule;
