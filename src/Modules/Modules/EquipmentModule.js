const GModule = require("../GModule");
const Inventory = require("../../Drawings/Inventory");
const Globals = require("../../Globals");
const InteractContainer = require("../../Discord/InteractContainer");


class EquipmentModule extends GModule {
    constructor() {
        super();
        this.commands = ["equip", "unequip", "equiplist", "use"];
        this.startLoading("Equipment");
        this.init();
        this.endLoading("Equipment");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let user = Globals.connectedUsers[interact.author.id];


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
                await interact.interaction?.deferReply();
                msg = await this.getDisplayIfSuccess(await axios.get("/game/equipment/show"), async (data) => {
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

        this.sendMessage(interact, msg, command);
    }
}

module.exports = EquipmentModule;