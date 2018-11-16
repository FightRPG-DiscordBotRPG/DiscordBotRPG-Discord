const GModule = require("../GModule");
const conn = require("../../../conf/mysql");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Craft = require("../../Drawings/Craft");

class CraftingModule extends GModule {
    constructor() {
        super();
        this.commands = ["craftlist", "craftshow", "craft", "collect", "resources"];
        this.startLoading("Crafting");
        this.init();
        this.endLoading("Crafting");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "craftlist":
                data = await axios.get("/game/crafting/craftlist/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Craft.getCraftList(data);
                } else {
                    msg = data.error;
                }
                break;

            case "craftshow":
                data = await axios.get("/game/crafting/craftshow/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Craft.craftToEmbed(data);
                } else {
                    msg = data.error;
                }
                break;

            case "craft":
                data = await axios.post("/game/crafting/craft", {
                    idCraft: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "collect":
                data = await axios.post("/game/crafting/collect", {
                    idResource: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "resources":
                data = await axios.get("/game/crafting/ressources");
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

module.exports = CraftingModule;