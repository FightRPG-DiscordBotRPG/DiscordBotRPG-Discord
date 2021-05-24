const GModule = require("../GModule");
const Inventory = require("../../Drawings/Inventory");
const Globals = require("../../Globals");


class EquipmentModule extends GModule {
    constructor() {
        super();
        this.commands = ["equip", "unequip", "equiplist", "equipment", "equips", "use"];
        this.startLoading("Equipment");
        this.init();
        this.endLoading("Equipment");
    }

    async run(message, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let user = Globals.connectedUsers[message.author.id];


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
            case "equips":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/equipment/show"),  async (data) => {
                    return await Inventory.displayAsList(data, false, user);
                });
                break;

            case "use":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/equipment/use", {
                    idItem: args[0],
                    amount: args[1],
                }));
                break;
        }

        this.sendMessage(message, msg, command);
    }
}

module.exports = EquipmentModule;