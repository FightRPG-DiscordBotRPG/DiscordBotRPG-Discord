const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const ItemShow = require("../../Drawings/ItemShow");
const Inventory = require("../../Drawings/Inventory");
const Emojis = require("../../Drawings/Emojis");


class InventoryModule extends GModule {
    constructor() {
        super();
        this.commands = ["item", "itemfav", "itemunfav", "inv", "inventory", "sell", "sellall", "sendmoney"];
        this.startLoading("Inventory");
        this.init();
        this.endLoading("Inventory");
    }

    async run(message, command, args) {
        let msg = "";
        let mentions = message.mentions.users;
        let firstMention;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let idRarity, idType, level;

        switch (command) {
            case "item":
                data = await axios.get("/game/inventory/item/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    let itemmsg;
                    if (data.equippedStats != null) {
                        itemmsg = ItemShow.showInInventoryItem(data);
                    } else {
                        itemmsg = ItemShow.showEquippedItem(data);
                    }

                    let isEquipped = isNaN(parseInt(args[0]));
                    let sellEmoji = Emojis.getID("money_bag");
                    let equipUnequipEmoji = isEquipped ? Emojis.getID("backpack") : Emojis.getID("shield");
                    let favoEmoji = data.item.isFavorite == false ? Emojis.getID("star") : Emojis.getID("eight_pointed_black_star");
                    let itemmsgsent = await message.channel.send(itemmsg).catch(() => null);

                    Promise.all([
                        data.item.isFavorite == true ? null : (isEquipped ? null : itemmsgsent.react(sellEmoji)),
                        itemmsgsent.react(favoEmoji),
                        data.item.equipable == true ? itemmsgsent.react(equipUnequipEmoji) : null,
                    ]).catch(() => null);

                    const filter = (reaction, user) => {
                        return [sellEmoji, favoEmoji, equipUnequipEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    const collector = itemmsgsent.createReactionCollector(filter, {
                        time: 22000,
                        max: 3,
                    });

                    collector.on('collect', async (reaction) => {
                        let dataCollector;
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
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                            case sellEmoji:
                                dataCollector = await axios.post("/game/inventory/sell", {
                                    idItem: data.item.id,
                                    number: 1,
                                    isRealID: true,
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }

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
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                        }
                        if (msgCollector != null) {
                            this.sendMessage(message, msgCollector);
                        }

                    });

                    collector.on('end', async (reactions) => {
                        if (!itemmsgsent.deleted && message.channel.type != "dm") {
                            itemmsgsent.clearReactions();
                        }
                    });
                } else {
                    msg = data.error;
                }
                break;

            case "itemfav":
                data = await axios.post("/game/inventory/itemfav", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "itemunfav":
                data = await axios.post("/game/inventory/itemunfav", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "inv":
            case "inventory":
                let page = 1;
                if (args.length > 0) {
                    if (args.length > 1) {
                        if (args[0] != null) {
                            switch (args[0]) {
                                case "rarity":
                                    idRarity = args[1];
                                    break;
                                case "type":
                                    idType = args[1];
                                    break;
                                case "level":
                                    level = args[1];
                                    break;
                            }
                        }
                        page = args[2] != null ? args[2] : 1;
                    } else {
                        page = args[0];
                    }
                }

                data = await axios.get("/game/inventory/show/" + page, {
                    params: {
                        idRarity: idRarity,
                        idType: idType,
                        level: level
                    }
                });
                data = data.data;
                if (data.error == null) {
                    let inventoryMessage = await message.channel.send(Inventory.ciDisplay(data)).catch(e => null);
                    let isDM = message.channel.type == "dm";
                    var invCurrentPage = data.page;
                    let currentMessageReactions = [];

                    let nextEmoji = Emojis.getString("right_arrow");
                    let backEmoji = Emojis.getString("left_arrow");

                    if (!inventoryMessage.deleted) {
                        if (data.page > 1) {
                            currentMessageReactions.push(await inventoryMessage.react(backEmoji));
                        }
                        if (data.page < data.maxPage) {
                            currentMessageReactions.push(await inventoryMessage.react(nextEmoji));
                        }
                    }


                    const filter = (reaction, user) => {
                        return [nextEmoji, backEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    const collectorInventory = inventoryMessage.createReactionCollector(filter, {
                        time: 60000,
                    });

                    collectorInventory.on('collect', async (reaction) => {
                        let dataCollector;
                        let msgCollector = null;
                        switch (reaction.emoji.name) {
                            case nextEmoji:
                                dataCollector = await axios.get("/game/inventory/show/" + (invCurrentPage + 1), {
                                    params: {
                                        idRarity: idRarity,
                                        idType: idType,
                                        level: level
                                    }
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = Inventory.ciDisplay(dataCollector);
                                    invCurrentPage++;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                            case backEmoji:
                                dataCollector = await axios.get("/game/inventory/show/" + (invCurrentPage - 1), {
                                    params: {
                                        idRarity: idRarity,
                                        idType: idType,
                                        level: level
                                    }
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = Inventory.ciDisplay(dataCollector);
                                    invCurrentPage--;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                        }
                        if (msgCollector != null && !inventoryMessage.deleted) {
                            if (isDM) {
                                for (let i in currentMessageReactions) {
                                    currentMessageReactions[i] = currentMessageReactions[i].remove();
                                }
                                await Promise.all(currentMessageReactions);
                                currentMessageReactions = [];
                            } else {
                                await inventoryMessage.clearReactions();
                            }
                            await inventoryMessage.edit(msgCollector);
                            if (dataCollector.error == null) {
                                if (dataCollector.page > 1) {
                                    currentMessageReactions.push(await inventoryMessage.react(backEmoji));
                                }
                                if (dataCollector.page < dataCollector.maxPage) {
                                    currentMessageReactions.push(await inventoryMessage.react(nextEmoji));
                                }
                            }
                        }

                    });

                    collectorInventory.on('end', async (reactions) => {
                        if (!inventoryMessage.deleted) {
                            if (!isDM) {
                                inventoryMessage.clearReactions()
                            } else {
                                for (let i in currentMessageReactions) {
                                    currentMessageReactions[i] = currentMessageReactions[i].remove();
                                }

                            }
                        }
                    });

                } else {
                    msg = data.error;
                }
                break;

            case "sell":
                data = await axios.post("/game/inventory/sell", {
                    idItem: args[0],
                    number: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "sellall":
                if (args.length > 0) {
                    if (args.length > 1) {
                        if (args[0] != null) {
                            switch (args[0]) {
                                case "rarity":
                                    idRarity = args[1];
                                    break;
                                case "type":
                                    idType = args[1];
                                    break;
                                case "level":
                                    level = args[1];
                                    break;
                            }
                        }
                    }
                }

                data = await axios.post("/game/inventory/sellall", {
                    idRarity: idRarity,
                    idType: idType,
                    level: level
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "sendmoney":
                firstMention = mentions.first();
                let isMention = false;
                let mId = 0;
                if (firstMention) {
                    args[0] = firstMention.id;
                    isMention = true;
                }
                data = await axios.post("/game/inventory/sendmoney", {
                    id: args[0],
                    isMention: isMention,
                    amount: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }

    displayInventoryMessage(message, args) {

    }
}

module.exports = InventoryModule;