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
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Skill = require("../../Drawings/Character/Skill");
const SkillBuild = require("../../Drawings/Character/SkillBuild");

class CharacterModule extends GModule {
    constructor() {
        super();
        this.commands = ["reset", "leaderboard", "info", "attributes", "up", "achievements", "talents", "talentshow", "talentup", "skillshow", "buildshow", "buildadd", "buildremove", "buildmove", "buildclear", "talentsexport", "talentsimport", "profile", "resettalents"];
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

                            let embedMessage = this.getResetEmbed("", data);

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

            case "resettalents":
                if (args[0] === "confirm") {
                    msg = this.getBasicSuccessErrorMessage(await axios.get("/game/character/talents/reset"));
                } else {
                    msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), async (data) => {
                        if (data.error != null) {
                            return data.error;
                        } else {

                            let embedMessage = this.getResetEmbed("talents", data);

                            this.confirmListener(message, embedMessage, async (validation) => {
                                if (validation == true) {
                                    return this.getBasicSuccessErrorMessage(await axios.get("/game/character/talents/reset"));
                                } else {
                                    return Translator.getString(data.lang, "character", "reset_talents_cancel");
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
            case "profile":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), async (data) => {
                    let displayAttributesEmoji = Emojis.general.yellow_book;
                    let displayAdvancementsEmoji = Emojis.emojisProd.exp.id;
                    let displayResourcesEmoji = Emojis.general.red_heart;
                    let displayOtherEmoji = Emojis.general.clipboard;

                    let emojisList = [
                        displayAttributesEmoji,
                        displayAdvancementsEmoji,
                        displayResourcesEmoji,
                        displayOtherEmoji
                    ];

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(message, user.infoPanel.toString(data, user), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                        }
                    });

                    reactWrapper.collector.on('collect', async (reaction) => {
                        switch (reaction.emoji.name) {
                            case displayAttributesEmoji:
                                user.infoPanel.displayAttributes = !user.infoPanel.displayAttributes;
                                break;
                            case displayResourcesEmoji:
                                user.infoPanel.displayResources = !user.infoPanel.displayResources;
                                break;
                            case displayOtherEmoji:
                                user.infoPanel.displayOther = !user.infoPanel.displayOther;
                                break;
                        }

                        switch (reaction.emoji.id) {
                            case displayAdvancementsEmoji:
                                user.infoPanel.displayAdvancement = !user.infoPanel.displayAdvancement;
                                break;
                        }

                        await reactWrapper.edit(user.infoPanel.toString(data, user), emojisList);
                    });
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
            case "talentsexport":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/talents/export"), (data) => {
                    return data.talents;
                });
                break;
            case "talentsimport":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/character/talents/import", { talentsIds: args[0] }));
                break;
            case "talentshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/talents/show/" + args[0]), async (data) => {

                    let talentTakeEmoji = Emojis.general.raised_hand;

                    let emojisList = [
                        data.unlockable ? talentTakeEmoji : null
                    ];

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(message, Talents.showOne(data, user), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                            max: 1,
                        }
                    });

                    reactWrapper.collector.on('collect', async (reaction) => {
                        switch (reaction.emoji.name) {
                            case talentTakeEmoji:
                                this.run(message, "talentup", [data.node.id]);
                                break;
                        }
                    });
                });
                break;
            case "talentup":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/character/talents/up/", {
                    idNode: args[0],
                }), (data) => {

                    let skillsUnlockText = data.node.skillsUnlockedNames.length > 0 ? ("\n" + Translator.getString(user.lang, "talents", "up_success_unlock_skills", [data.node.skillsUnlockedNames.join(", ")])) : "";
                    return Translator.getString(user.lang, "talents", "up_success_unlock", [`${data.node.visuals.name} (${data.node.id})`])
                        + skillsUnlockText
                        + "\n"
                        + Translator.getString(user.lang, "character", "attribute_x_points_available" + (data.pointsLeft > 1 ? "_plural" : ""), [data.pointsLeft]);
                });
                break;
            case "skillshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/skills/show/" + args[0]), async (data) => {
                    return Skill.toString(data, user);
                });
                break;
            case "buildshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/build/show/"), async (data) => {

                    //let talentTakeEmoji = Emojis.general.raised_hand;

                    //let emojisList = [
                    //    data.unlockable ? talentTakeEmoji : null
                    //];

                    //let reactWrapper = new MessageReactionsWrapper();

                    //await reactWrapper.load(message, Talents.showOne(data, user), {
                    //    reactionsEmojis: emojisList,
                    //    collectorOptions: {
                    //        time: 22000,
                    //        max: 1,
                    //    }
                    //});

                    //reactWrapper.collector.on('collect', async (reaction) => {
                    //    switch (reaction.emoji.name) {
                    //        case talentTakeEmoji:
                    //            this.run(message, "talentup", [data.node.id]);
                    //            break;
                    //    }
                    //});

                    return SkillBuild.toString(data, user);
                });
                break;
            case "buildadd":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/character/build/add", {
                    idSkill: args[0],
                }));
                break;
            case "buildmove": {
                let priority = parseInt(args[1], 10) - 1;
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/character/build/move", {
                    idSkill: args[0],
                    priority: priority
                }));
            }
                break;
            case "buildremove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/character/build/remove", {
                    idSkill: args[0],
                }));
                break;
            case "buildclear":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/character/build/clear"));
                break;

        }

        this.sendMessage(message, msg);
    }

    /**
     * 
     * @param {string} optionalType
     * @param {any} lang
     */
    getResetEmbed(optionalType, data) {
        if (optionalType) {
            optionalType = "_" + optionalType;
        }
        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Emojis.getString("scroll") + " " + Translator.getString(data.lang, "character", "reset" + optionalType + "_price_title"))
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "travel", "gold_price_title"), Translator.getString(data.lang, "travel", "gold_price_body", [data.resetValue]), true)
            .addField(Emojis.getString("q_mark") + " " + Translator.getString(data.lang, "character", "sure_to_reset" + optionalType + "_title"), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));
    }

}

module.exports = CharacterModule;
