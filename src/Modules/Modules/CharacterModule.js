const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const TextDrawing = require("../../Drawings/TextDrawings");
const Achievements = require("../../Drawings/Achievements");
const Discord = require("discord.js");
const Talents = require("../../Drawings/Character/Talents");
const User = require("../../Users/User");
const InfoPanel = require("../../Drawings/Character/InfoPanel");

class CharacterModule extends GModule {
    constructor() {
        super();
        this.commands = ["reset", "leaderboard", "info", "attributes", "up", "achievements", "talents", "talentshow", "talentup"];
        this.startLoading("Character");
        this.init();
        this.endLoading("Character");

        this.authorizedAttributes = ["str", "int", "con", "dex", "cha", "will", "luck", "wis", "per"];
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} command
     * @param {Array} args
     */
    async run(message, command, args) {
        let msg = "";
        /**
         * @type {User}
         **/
        let user = Globals.connectedUsers[message.author.id];
        let axios = user.getAxios();

        switch (command) {

            case "reset":
                if (args[0] === "confirm") {
                    msg = this.getBasicSuccessErrorMessage(await axios.get("/game/character/reset"));
                } else {
                    msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), async (data) => {
                        if (data.error != null) {
                            return data.error;
                        } else {

                            let embedMessage = new Discord.MessageEmbed()
                                .setColor([0, 255, 0])
                                .setAuthor(Emojis.getString("scroll") + " " + Translator.getString(data.lang, "character", "reset_price_title"))
                                .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "travel", "gold_price_title"), Translator.getString(data.lang, "travel", "gold_price_body", [data.resetValue]), true)
                                .addField(Emojis.getString("q_mark") + " " + Translator.getString(data.lang, "character", "sure_to_reset_title"), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));

                            this.confirmListener(message, embedMessage, async (validation) => {
                                if (validation == true) {
                                    return this.getBasicSuccessErrorMessage(await axios.get("/game/character/reset"));
                                } else {
                                    return Translator.getString(data.lang, "character", "reset_cancel");
                                }
                            });
                        }
                    });

                }


                break;

            case "leaderboard":
                await this.drawLeaderboard(message, args);
                break;

            case "info":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), (data) => {
                    return user.infoPanel.toString(data, user);
                });
                break;

            case "attributes":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), (data) => {
                    let panel = new InfoPanel();
                    panel.disableAll();
                    panel.displayAttributes = true;
                    return panel.toString(data, user);
                });
                break;

            case "up":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/character/up", {
                    attr: args[0],
                    number: args[1],
                }), (data) => {
                    return Translator.getString(data.lang, "character", "attribute_up_to", [this.getToStrShort(args[0]), data.value]) + ". " + (data.pointsLeft > 1 ? Translator.getString(data.lang, "character", "attribute_x_points_available_plural", [data.pointsLeft]) : Translator.getString(data.lang, "character", "attribute_x_points_available", [data.pointsLeft]));
                });
                break;
            case "achievements":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/achievements/" + args[0]), async (data) => {
                    await this.pageListener(data, message, Achievements.toString(data), async (currPage) => {
                        let d = await axios.get("/game/character/achievements/" + currPage);
                        return d.data;
                    }, async (newData) => {
                        return Achievements.toString(newData);
                    });
                });
                break;
            case "talents":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/talents"), (data) => {
                    return Talents.toString(data, user);

                });
                break;
            case "talentshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/talents/show/" + args[0]), async (data) => {
                    return Talents.showOne(data, user);
                });
                break;
            case "talentup":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/character/talents/up/", {
                    idNode: args[0],
                }), (data) => {
                    return Translator.getString(user.lang, "talents", "up_success_unlock", [`${data.node.visuals.name} (${data.node.id})`])
                        + "\n"
                        + Translator.getString(user.lang, "talents", "up_success_unlock_skills", [data.node.skillsUnlockedNames.join(", ")])
                        + "\n"
                        + Translator.getString(user.lang, "character", "attribute_x_points_available" + (data.pointsLeft > 1 ? "_plural" : ""), [data.pointsLeft]);
                });
                break;

        }

        this.sendMessage(message, msg);
    }


}

module.exports = CharacterModule;
