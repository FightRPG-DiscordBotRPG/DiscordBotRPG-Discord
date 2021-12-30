const GModule = require("../GModule");
const Globals = require("../../Globals");
const WorldBosses = require("../../Drawings/WorldBosses");
const LeaderboardWBAttacks = require("../../Drawings/Leaderboard/LeaderboardWBAttacks");
const LeaderboardWBDamage = require("../../Drawings/Leaderboard/LeaderboardWBDamage");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const InteractContainer = require("../../Discord/InteractContainer");
const Discord = require("discord.js");

class WorldBossModule extends GModule {
    constructor() {
        super();
        this.commands = ["worldbossfight", "worldbossshowall", "worldbosslastinfo"];
        this.startLoading("World Boss");
        this.init();
        this.endLoading("World Boss");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let authorIdentifier = interact.author.id;
        let user = Globals.connectedUsers[interact.author.id];
        let axios = user.getAxios();

        switch (command) {
            case "worldbossshowall":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/all"), async (data) => {
                    //return WorldBosses.listToDiscord(data, Globals.connectedUsers[authorIdentifier], true);

                    let displayTravelEmoji = Emojis.general.horse_face;

                    let emojisList = [
                        displayTravelEmoji
                    ];

                    const options = InteractContainer.getReplyOptions(WorldBosses.listToDiscord(data, user, true));

                    if (data.bosses.length > 0) {
                        options.components.push(
                            new Discord.MessageActionRow()
                                .addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId(displayTravelEmoji)
                                        .setLabel(Translator.getString(user.lang, "world_bosses", "travel"))
                                        .setStyle("PRIMARY")
                                        .setEmoji(displayTravelEmoji)
                                )
                        );
                    }

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(interact, options, {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                            max: 1,
                        }
                    });

                    reactWrapper.collector.on('collect',
                        /**
                         * 
                         * @param {Discord.ButtonInteraction} reaction
                         */
                        async (reaction) => {
                            if (reaction.customId === displayTravelEmoji) {
                                interact.interaction = reaction;
                                let travelModule = Globals.moduleHandler.modules["TravelModule"];
                                travelModule.run(interact, "traveldirect", [data.bosses[0].idArea]);
                            }

                        });
                });
                break;

            case "worldbossfight":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/worldbosses/fight"), async (d1) => {
                    return await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/lastboss"), async (d2) => {
                        return await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/all"), async (d3) => {
                            return WorldBosses.attackToDiscord(d1, d2, d3, Globals.connectedUsers[authorIdentifier]);
                        });
                    });
                }, async (d1) => {
                    if (d1.error == Translator.getString(d1.lang, "world_bosses", "no_world_boss")) {
                        this.run(interact, "wbshowall", []);
                        return d1.error;
                    } else {
                        return d1.error;
                    }
                });
                break;

            case "worldbosslastinfo":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/worldbosses/display/lastboss"), (data) => {
                    return WorldBosses.lastBossStats(data);
                });
                break;
        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = WorldBossModule;