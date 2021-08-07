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
const Utils = require("../../Utils");
const Rebirth = require("../../Drawings/Character/Rebirth");
const State = require("../../Drawings/Fight/State");
const CharacterAppearance = require("../../Drawings/Character/CharacterAppearance");
const InteractContainer = require("../../Discord/InteractContainer");

class CharacterModule extends GModule {
    constructor() {
        super();
        this.commands = ["reset", "leaderboard", "info", "attributes", "up", "achievements", "talents", "talentshow", "talentup", "skillshow", "buildshow", "buildadd", "buildremove", "buildmove", "buildclear", "talentsexport", "talentsimport", "profile", "resettalents", "rebirth", "stateshow", "appearance", "talentsshow"];
        this.startLoading("Character");
        this.init();
        this.endLoading("Character");

        this.authorizedAttributes = ["str", "int", "con", "dex", "cha", "will", "luck", "wis", "per"];
    }

    /**
     * 
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        /**
         * @type {User}
         **/
        let user = Globals.connectedUsers[interact.author.id];
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

                            this.confirmListener(interact, embedMessage, async (validation) => {
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

                            this.confirmListener(interact, embedMessage, async (validation) => {
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
                await this.drawLeaderboard(interact, args);
                break;

            case "info":
            case "profile":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/info"), async (data) => {
                    let displayAttributesEmoji = Emojis.general.clipboard;
                    let displayAdvancementsEmoji = Emojis.emojisProd.exp;
                    let displayResourcesEmoji = Emojis.general.bar_chart;
                    let displayOtherEmoji = Emojis.general.q_mark;
                    let rebirthEmoji = Emojis.emojisProd.rebirth;

                    let emojisList = [
                        displayAttributesEmoji,
                        displayAdvancementsEmoji,
                        displayResourcesEmoji,
                        displayOtherEmoji,
                        rebirthEmoji
                    ];

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(interact, user.infoPanel.toString(data, user), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                        }
                    });

                    // For tutorial
                    await user.tutorial.reactOnCommand("info", interact, user.lang);

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
                            case displayAdvancementsEmoji.id:
                                user.infoPanel.displayAdvancement = !user.infoPanel.displayAdvancement;
                                break;
                            case rebirthEmoji.id:
                                return this.run(interact, "rebirth", []);
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
                    await this.pageListener(data, interact, Achievements.toString(data), async (currPage) => {
                        let d = await axios.get("/game/character/achievements/" + currPage);
                        return d.data;
                    }, async (newData) => {
                        return Achievements.toString(newData);
                    });
                });
                break;
            case "talents":
            case "talentsshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/talents"), async (data) => {
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

                    await reactWrapper.load(interact, Talents.showOne(data, user), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 22000,
                            max: 1,
                        }
                    });

                    // For tutorial
                    await user.tutorial.reactOnCommand("talentshow", interact, user.lang);

                    reactWrapper.collector.on('collect', async (reaction) => {
                        switch (reaction.emoji.name) {
                            case talentTakeEmoji:
                                this.run(interact, "talentup", [data.node.id]);
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
            case "stateshow":
                //msg = await this.getDisplayIfSuccess(await axios.get("/game/character/states/show/" + args[0]), async (data) => {
                //    return State.toString(data, user);
                //});
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
            case "rebirth": {
                if (args[0] == "craftlevel") {
                    args[0] = "craft_level";
                }

                if (args[0] == "craft_level" || args[0] == "level") {

                    msg = await this.getDisplayIfSuccess(await axios.get("/game/character/rebirth"), async (data) => {

                        let canRebirthData, rebirthDescriptionType, rebirthTypeBonuses, titleType, emojiRebirth, requiredItems;

                        if (args[0] == "level") {
                            emojiRebirth = Emojis.emojisProd.level.string;
                            canRebirthData = Rebirth.getRebirthPossible(data.rebirthLevel, data.maxRebirthLevel, data.level, data.maxLevel, data.nextRebirthsLevelsModifiers?.requiredItems, user);
                            requiredItems = data.nextRebirthsLevelsModifiers?.requiredItems;
                            rebirthDescriptionType = "rebirth_sure_to_description";
                            rebirthTypeBonuses = Rebirth.rebirthsBonusesTypes.only_char;
                            titleType = `${emojiRebirth} ${Translator.getString(user.lang, "character", "level")} - ${Rebirth.getRebirthAvailabilityString(canRebirthData.canRebirth, user.lang)}`;
                        } else {
                            emojiRebirth = Emojis.general.hammer;
                            canRebirthData = Rebirth.getRebirthPossible(data.craft.rebirthLevel, data.maxRebirthLevel, data.craft.level, data.craft.maxLevel, data.craft.nextRebirthsLevelsModifiers?.requiredItems, user);
                            requiredItems = data.craft.nextRebirthsLevelsModifiers?.requiredItems
                            rebirthDescriptionType = "rebirth_sure_to_description_craft";
                            rebirthTypeBonuses = Rebirth.rebirthsBonusesTypes.only_craft;
                            titleType = `${emojiRebirth} ${Translator.getString(user.lang, "character", "craft_level")} - ${Rebirth.getRebirthAvailabilityString(canRebirthData.canRebirth, user.lang)}`;
                        }




                        let confirmEmbed = new Discord.MessageEmbed()
                            .setColor([0, 255, 0])
                            .setAuthor(Translator.getString(user.lang, "character", "rebirth_title"));

                        if (canRebirthData.canRebirth) {

                            confirmEmbed = confirmEmbed
                                .addField(titleType, Emojis.general.warning + " " + Translator.getString(user.lang, "character", rebirthDescriptionType) + "\n" + Rebirth.getRebirthBonuses(data, user, rebirthTypeBonuses, false) + "\n");

                            confirmEmbed = Utils.addToEmbedRequiredItems(confirmEmbed, requiredItems, user.lang)
                                .addField(Emojis.getString("q_mark") + " " + Translator.getString(data.lang, "character", "rebirth_sure_to", [emojiRebirth + " " + Translator.getString(user.lang, "character", args[0])]), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));



                            this.confirmListener(interact, confirmEmbed, async (validate) => {
                                //return await this.travelPost(args, axios, type);
                                if (validate) {
                                    return this.getBasicSuccessErrorMessage(await axios.post("/game/character/rebirth/", {
                                        rebirthType: args[0]
                                    }));
                                } else {
                                    return Translator.getString(user.lang, "character", "rebirth_cancelled");
                                }
                            });
                        } else {
                            return Utils.addToEmbedRequiredItems(confirmEmbed, requiredItems, user.lang)
                                .addField(titleType, canRebirthData.reason);
                        }
                    });
                }
                else {
                    msg = await this.getDisplayIfSuccess(await axios.get("/game/character/rebirth"), async (data) => {

                        // Rebirth ask type

                        let rebirthLevelEmoji = Emojis.emojisProd.level;
                        let rebirthCraftLevelEmoji = Emojis.general.hammer;

                        let canRebirthLevel = data.rebirthLevel < data.maxRebirthLevel && data.level == data.maxLevel;
                        let canRebirthCraft = data.craft.rebirthLevel < data.maxRebirthLevel && data.craft.level == data.maxLevel;

                        let emojisList = [
                            canRebirthLevel ? rebirthLevelEmoji : null,
                            canRebirthCraft ? rebirthCraftLevelEmoji : null
                        ];


                        let reactWrapper = new MessageReactionsWrapper();
                        let description = `${Emojis.emojisProd.level.string} ${Translator.getString(user.lang, "character", "level")} - ${Rebirth.getRebirthAvailabilityString(canRebirthLevel)}
                            ${Emojis.general.hammer} ${Translator.getString(user.lang, "character", "craft_level")} - ${Rebirth.getRebirthAvailabilityString(canRebirthCraft)}`;


                        await reactWrapper.load(interact,
                            new Discord.MessageEmbed()
                                .setColor([0, 255, 0])
                                .setAuthor(Translator.getString(user.lang, "character", "rebirth_title"))
                                .addField(Emojis.emojisProd.rebirth.string + " " + Translator.getString(user.lang, "character", "current_bonuses"), Rebirth.getRebirthBonuses(data, user, Rebirth.rebirthsBonusesTypes.all, true) + "\n")
                                .addField(Emojis.general.scroll + " " + Translator.getString(data.lang, "character", "rebirth_do_you_want"), description)
                            , {
                                reactionsEmojis: emojisList,
                                collectorOptions: {
                                    time: 20000,
                                    max: 2,
                                }
                            });

                        reactWrapper.collector.on('collect', async (reaction) => {
                            if (reaction.emoji.id === rebirthLevelEmoji.id) {
                                await this.run(interact, "rebirth", ["level"]);
                            } else if (reaction.emoji.name === rebirthCraftLevelEmoji) {
                                await this.run(interact, "rebirth", ["craft_level"]);
                            }
                        });


                    });
                }
            } break;
            case "appearance":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/character/appearance"), async (data) => {
                    if (!user.pendingAppearance) {
                        user.pendingAppearance = new CharacterAppearance();
                        user.pendingAppearance.requiredAppearancesTypeForCharacter = data.requiredAppearancesTypeForCharacter;
                        user.pendingAppearance.selectableBodyColors = data.selectableBodyColors;
                        user.pendingAppearance.selectableEyeColors = data.selectableEyeColors;
                        user.pendingAppearance.selectableHairColors = data.selectableHairColors;
                        await user.pendingAppearance.setupFromData(data.currentAppearance);
                        await user.pendingAppearance.setupFromDataEdition(data.currentAppearance);
                    }

                    await user.pendingAppearance.handleEdition(interact, user);
                });
                break;

        }

        this.sendMessage(interact, msg, command);
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
