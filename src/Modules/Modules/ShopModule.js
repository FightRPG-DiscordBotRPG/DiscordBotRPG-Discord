const GModule = require("../GModule");
const Shop = require("../../Drawings/Shop");
const Globals = require("../../Globals");


class EquipmentModule extends GModule {
    constructor() {
        super();
        this.commands = ["sitems", "sbuy"];
        this.startLoading("Equipment");
        this.init();
        this.endLoading("Equipment");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "sitems":
                data = await axios.get("/game/shop/items/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Shop.displayItems(data);
                } else {
                    msg = data.error;
                }
                break;


            case "sbuy":
                data = await axios.post("/game/shop/buy", {
                    idItem: args[0],
                    amount: args[1],
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

module.exports = EquipmentModule;