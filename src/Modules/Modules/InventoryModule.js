const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const ItemShow = require("../../Drawings/ItemShow");
const Inventory = require("../../Drawings/Inventory");


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

        switch (command) {
            case "item":
                data = await axios.get("/game/inventory/item/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    if (data.equippedStats != null) {
                        msg = ItemShow.showInInventoryItem(data);
                    } else {
                        msg = ItemShow.showEquippedItem(data);
                    }
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
                data = await axios.get("/game/inventory/show/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Inventory.ciDisplay(data);
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
                data = await axios.post("/game/inventory/sellall");
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
}

module.exports = InventoryModule;