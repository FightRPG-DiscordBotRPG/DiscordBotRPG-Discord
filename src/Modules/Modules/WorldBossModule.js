const GModule = require("../GModule");
const Globals = require("../../Globals");
const WorldBosses = require("../../Drawings/WorldBosses");
const LeaderboardWBAttacks = require("../../Drawings/Leaderboard/LeaderboardWBAttacks");
const LeaderboardWBDamage = require("../../Drawings/Leaderboard/LeaderboardWBDamage");
const Translator = require("../../Translator/Translator");


class WorldBossModule extends GModule {
    constructor() {
        super();
        this.commands = ["wbshowall", "wbfight", "wbattack", "wblastinfo", "wbleaderboard"];
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
                    msg = WorldBosses.listToDiscord(data, Globals.connectedUsers[authorIdentifier], true);
                } else {
                    msg = data.error;
                }
                break;

            case "wbfight":
            case "wbattack":
                data = await axios.post("/game/worldbosses/fight");
                data = data.data;
                if (data.error == null) {
                    let d1 = data;
                    data = await axios.get("/game/worldbosses/display/lastboss");
                    data = data.data;
                    if (data.error == null) {
                        let d2 = data;
                        data = await axios.get("/game/worldbosses/display/all");
                        data = data.data;
                        if (data.error == null) {
                            let d3 = data;
                            msg = WorldBosses.attackToDiscord(d1, d2, d3, Globals.connectedUsers[authorIdentifier]);
                        } else {
                            msg = data.error;
                        }
                    } else {
                        msg = data.error;
                    }
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
            case "wbleaderboard":
                if ((args[0] && !args[1] && !Number.isInteger(Number.parseInt(args[0]))) || (args[0] && args[1])) {
                    args[0] = "wb" + args[0];
                }
                this.drawLeaderboard(message, args, "damage")
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = WorldBossModule;