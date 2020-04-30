const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Areas = require("../../Drawings/Areas");


class ConquestModule extends GModule {
    constructor() {
        super();
        this.commands = ["arealevelup", "areaupbonus", "areabonuseslist", "areaconquest"];
        this.startLoading("Conquest");
        this.init();
        this.endLoading("Conquest");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        //PStatistics.incrStat(Globals.connectedUsers[authorIdentifier].character.id, "commands_areas", 1);
        switch (command) {
            case "arealevelup":
                data = await axios.post("/game/conquest/area/levelup/");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "areaupbonus":
                data = await axios.post("/game/conquest/area/bonus/up", {
                    bonus_identifier: args[0],
                    number: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
                
            case "arearesetbonuses":
                data = await axios.post("/game/conquest/area/resetbonuses/");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "areabonuseslist":
                data = await axios.get("/game/conquest/area/bonuses");
                data = data.data;
                if (data.error == null) {
                    msg = Areas.bonusesListToStr(data);
                } else {
                    msg = data.error;
                }
                break;

            case "areaconquest":

                data = await axios.get("/game/conquest/area");
                data = data.data;
                if (data.error == null) {
                    msg = Areas.conquestToStr(data);
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = ConquestModule;
