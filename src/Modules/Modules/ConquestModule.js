const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Areas = require("../../Drawings/Areas");


class ConquestModule extends GModule {
    constructor() {
        super();
        this.commands = ["arealevelup", "areaupbonus", "areabonuseslist", "areaconquest", "arearesetbonuses"];
        this.startLoading("Conquest");
        this.init();
        this.endLoading("Conquest");
    }

    async run(message, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let user = Globals.connectedUsers[message.author.id];
        switch (command) {
            case "arealevelup":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/conquest/area/levelup/"))
                break;

            case "areaupbonus":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/conquest/area/bonus/up", {
                    bonus_identifier: args[0],
                    number: args[1]
                }));
                break;
                
            case "arearesetbonuses":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/conquest/area/bonus/resetbonuses"))
                break;

            case "areabonuseslist":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/conquest/area/bonuses"), (newData) => Areas.bonusesListToStr(newData))
                break;

            case "areaconquest":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/conquest/area"), (newData) => Areas.conquestToStr(newData, user))
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = ConquestModule;
