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
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "wbshowall":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/all"), (data) => {
                    return WorldBosses.listToDiscord(data, Globals.connectedUsers[authorIdentifier], true);
                });
                break;

            case "wbfight":
            case "wbattack":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/worldbosses/fight"), async (d1) => {
                    return await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/lastboss"), async (d2) => {
                        return await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/all"), async (d3) => {
                            return WorldBosses.attackToDiscord(d1, d2, d3, Globals.connectedUsers[authorIdentifier]);
                        });
                    });
                }, async (d1) => {
                        if (d1.error == Translator.getString(d1.lang, "world_bosses", "no_world_boss")) {
                            this.run(message, "wbshowall", []);
                            return d1.error;
                        } else {
                            return d1.error;
                        }
                });
                break;

            case "wblastinfo":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/lastboss"), (data) => {
                    return WorldBosses.lastBossStats(data);
                });
                break;
            case "wbleaderboard":
                if ((args[0] && !Number.isInteger(Number.parseInt(args[0]))) || (args[0] && args[1])) {
                    args[0] = "wb" + args[0];
                } else {
                    args[0] = "wbdamage";
                }
                this.drawLeaderboard(message, args, "damage")
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = WorldBossModule;