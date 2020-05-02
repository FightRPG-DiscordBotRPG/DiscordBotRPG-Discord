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
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "equip":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/equipment/equip", {
                    idItem: args[0]
                }));
                break;

            case "unequip":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/equipment/unequip", {
                    idItem: args[0]
                }));
                break;

            case "equiplist":
            case "equipment":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/equipment/show"), (data) => {
                    return Inventory.displayAsList(data, false);
                });
                break;

            case "use":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/equipment/use", {
                    idItem: args[0],
                    amount: args[1],
                }));
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = EquipmentModule;