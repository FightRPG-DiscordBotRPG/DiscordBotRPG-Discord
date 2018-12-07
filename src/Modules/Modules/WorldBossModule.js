const GModule = require("../GModule");
const Globals = require("../../Globals");
const WorldBosses = require("../../Drawings/WorldBosses");


class WorldBossModule extends GModule {
    constructor() {
        super();
        this.commands = ["wbshowall", "wbfight", "wbattack", "wblastinfo"];
        this.startLoading("World Boss");
        this.init();
        this.endLoading("World Boss");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "wbshowall":
                data = await axios.get("/game/worldbosses/display/all");
                data = data.data;
                if (data.error == null) {
                    msg = WorldBosses.listToDiscord(data);
                } else {
                    msg = data.error;
                }
                break;

            case "wbfight":
            case "wbattack":
                data = await axios.post("/game/worldbosses/fight");
                data = data.data;
                if (data.error == null) {
                    msg = "You've inflicted " + data.damage + " damage";
                } else {
                    msg = data.error;
                }
                break;

            case "wblastinfo":
                data = await axios.get("/game/worldbosses/display/lastboss");
                data = data.data;
                if (data.error == null) {
                    msg = WorldBosses.lastBossStats(data);
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = WorldBossModule;