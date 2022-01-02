const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const ItemShow = require("../../Drawings/ItemShow");
const Inventory = require("../../Drawings/Inventory");
const Emojis = require("../../Drawings/Emojis");
const Discord = require("discord.js");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const InteractContainer = require("../../Discord/InteractContainer");


class InventoryModule extends GModule {
    constructor() {
        super();
        this.commands = ["itemid", "itemtype", "itemfavid", "itemfavtype", "itemunfavid", "itemunfavtype", "inventory", "sell", "sellall", "sendmoney"];
        this.startLoading("Inventory");
        this.init();
        this.endLoading("Inventory");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let mentions = interact.mentions;
        let firstMention;
        let user = Globals.connectedUsers[interact.author.id];
        let axios = user.getAxios();
        let searchFilters;

        switch (command) {
            case "itemid":
            case "itemtype":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/inventory/item/" + args[0]), async (data) => {
                    let itemmsg;
                    if (data.equippedStats != null) {
                        itemmsg = ItemShow.showItem(data, user);
                    } else {
                        itemmsg = ItemShow.showItem(data, user, true);
                    }

                    let isEquipped = (isNaN(parseInt(args[0])) && args[0] !== "last");
                    let sellEmoji = "money_bag";
                    let equipUnequipEmoji = isEquipped ? "backpack" : "shield";
                    let favoEmoji = data.item.isFavorite == false ? "star" : "eight_pointed_black_star";
                    let addToTradeEmoji = "baggage_claim";

                    // See if he is trading
                    let isTrading = await axios.get("/game/character/isTrading");
                    isTrading = isTrading.data;
                    isTrading = isTrading.error == null ? isTrading.isTrading : false;


                    const emojisList = [
                        data.item.isFavorite == true ? null : (isEquipped ? null : sellEmoji),
                        favoEmoji,
                        data.item.equipable == true ? equipUnequipEmoji : null,
                        isTrading == true ? addToTradeEmoji : null
                    ];

                    const options = InteractContainer.getReplyOptions(itemmsg);

                    const actionRow = new Discord.MessageActionRow();


                    for (let emojiName of emojisList) {
                        if (emojiName !== null) {
                            actionRow.addComponents(
                                new Discord.MessageButton()
                                    .setCustomId(emojiName)
                                    .setLabel(Translator.getString(user.lang, "inventory_equipment", emojiName))
                                    .setStyle("PRIMARY")
                                    .setEmoji(Emojis.general[emojiName])
                            );
                        }
                    }

                    options.components.push(
                        actionRow
                    );

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(interact, options, {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                            max: 3,
                        }
                    });

                    // For tutorial
                    await user.tutorial.reactOnCommand("item", interact, user.lang);

                    reactWrapper.collector.on('collect',
                        /**
                         * 
                         * @param {Discord.ButtonInteraction} reaction
                         */
                        async (reaction) => {
                            let dataCollector = null;
                            let msgCollector = null;
                            interact.interaction = reaction;
                            let usedCommand = null;

                            switch (reaction.customId) {
                                case equipUnequipEmoji:
                                    if (isEquipped) {
                                        dataCollector = await axios.post("/game/equipment/unequip", {
                                            idItem: data.item.id,
                                            isRealID: true,
                                        });
                                        usedCommand = "unequip";
                                    } else {
                                        dataCollector = await axios.post("/game/equipment/equip", {
                                            idItem: data.item.id,
                                            isRealID: true,
                                        });
                                        usedCommand = "equip";
                                    }
                                    break;
                                case sellEmoji:
                                    dataCollector = await axios.post("/game/inventory/sell", {
                                        idItem: data.item.id,
                                        number: 1,
                                        isRealID: true,
                                    });
                                    usedCommand = "sell";
                                    break;

                                case favoEmoji:
                                    if (data.item.isFavorite == false) {
                                        dataCollector = await axios.post("/game/inventory/itemfav", {
                                            idItem: data.item.id,
                                            isRealID: true,
                                        });
                                        usedCommand = "itemfav";
                                    } else {
                                        dataCollector = await axios.post("/game/inventory/itemunfav", {
                                            idItem: data.item.id,
                                            isRealID: true,
                                        });
                                        usedCommand = "itemunfav";
                                    }
                                    break;
                                case addToTradeEmoji:
                                    if (this.allModulesReference["TradeModule"] != null) {
                                        this.allModulesReference["TradeModule"].run(interact, "tadd", [data.idInInventory, data.item.number]);
                                    }
                                    break;
                            }

                            if (dataCollector != null) {
                                msgCollector = this.getBasicSuccessErrorMessage(dataCollector);
                                await this.sendMessage(interact, msgCollector, usedCommand);
                            }
                        });
                });
                break;

            case "itemfavid":
            case "itemfavtype":
            case "itemunfavid":
            case "itemunfavtype": {
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

            case "inventory":
                searchFilters = this.getSearchFilters(args);
                msg = await this.getDisplayIfSuccess(await axios.get("/game/inventory/show/" + searchFilters.page, {
                    params: searchFilters.params
                }), async (data) => {
                    await this.pageListener(data, interact, await Inventory.displayAsList(data, true, user), async (currPage) => {
                        let d = await axios.get("/game/inventory/show/" + currPage, {
                            params: searchFilters.params
                        });
                        return d.data;
                    }, async (newData) => {
                        return await Inventory.displayAsList(newData, true, user)
                    });
                    // For tutorial
                    await user.tutorial.reactOnCommand("inv", interact, user.lang);
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
                        this.confirmListener(interact, Inventory.ciValueSellAllDisplay(data, searchFilters.params), async (validate) => {
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
                firstMention = mentions?.first();
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

        this.sendMessage(interact, msg, command);
    }
}

module.exports = InventoryModule;
