const GModule = require("../GModule");
const Inventory = require("../../Drawings/Inventory");
const Globals = require("../../Globals");


class EquipmentModule extends GModule {
    constructor() {
        super();
        this.commands = ["equip", "unequip", "equiplist", "equipment", "use"];
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
            case "equip":
                data = await axios.post("/game/equipment/equip", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "unequip":
                data = await axios.post("/game/equipment/unequip", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "equiplist":
            case "equipment":
                data = await axios.get("/game/equipment/show");
                data = data.data;
                if (data.error == null) {
                    msg = Inventory.ceDisplay(data);
                } else {
                    msg = data.error;
                }
                break;

            case "use":
                data = await axios.post("/game/equipment/use", {
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