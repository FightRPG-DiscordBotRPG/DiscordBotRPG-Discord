const GModule = require("../GModule");
const Globals = require("../../Globals");
const WorldBosses = require("../../Drawings/WorldBosses");
const LeaderboardWBAttacks = require("../../Drawings/Leaderboard/LeaderboardWBAttacks");
const LeaderboardWBDamage = require("../../Drawings/Leaderboard/LeaderboardWBDamage");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");


class WorldBossModule extends GModule {
    constructor() {
        super();
        this.commands = ["wbshowall", "wbfight", "wbattack", "wblastinfo", "wbleaderboard", "wbs"];
        this.startLoading("World Boss");
        this.init();
        this.endLoading("World Boss");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let user = Globals.connectedUsers[message.author.id];
        let axios = user.getAxios();

        switch (command) {
            case "wbshowall":
            case "wbs":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/all"), async (data) => {
                    //return WorldBosses.listToDiscord(data, Globals.connectedUsers[authorIdentifier], true);

                    let displayTravelEmoji = Emojis.general.horse_face;

                    let emojisList = [
                        displayTravelEmoji
                    ];

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(message, WorldBosses.listToDiscord(data, user, true), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                            max: 1,
                        }
                    });

                    reactWrapper.collector.on('collect', async (reaction) => {

                        if (data.bosses.length === 0) {
                            return;
                        }

                        if (reaction.emoji.name === displayTravelEmoji) {
                            let travelModule = Globals.moduleHandler.modules["TravelModule"];
                            travelModule.run(message, "traveldirect", [data.bosses[0].idArea]);
                        }

                    });
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