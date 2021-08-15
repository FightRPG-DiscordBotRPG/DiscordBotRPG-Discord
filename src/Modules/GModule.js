const Globals = require("../Globals");
const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const Leaderboard = require("../Drawings/Leaderboard/Leaderboard");
const LeaderboardWBAttacks = require("../Drawings/Leaderboard/LeaderboardWBAttacks");
const LeaderboardWBDamage = require("../Drawings/Leaderboard/LeaderboardWBDamage");
const LeaderboardPvP = require("../Drawings/Leaderboard/LeaderboardPvP");
const LeaderboardLevel = require("../Drawings/Leaderboard/LeaderboardLevel");
const LeaderboardPower = require("../Drawings/Leaderboard/LeaderboardPower");
const LeaderboardGold = require("../Drawings/Leaderboard/LeaderboardGold");
const LeaderboardCraftLevel = require("../Drawings/Leaderboard/LeaderboardCraftLevel");
const LeaderboardAchievements = require("../Drawings/Leaderboard/LeaderboardAchievements");
const Emojis = require("../Drawings/Emojis");
const MessageReactionsWrapper = require("../MessageReactionsWrapper");
const User = require("../Users/User");
const InteractContainer = require("../Discord/InteractContainer");
const MenusAndButtons = require("../Drawings/MenusAndButtons");

class GModule {
    constructor() {
        this.isReloadable = true;
        this.loadingTime = 0;
        this.isModule = true;
        this.isLoaded = false;
        this.isActive = true;
        this.commands = [];
        /**
         * @type {Object<string, GModule>}
         **/
        this.allModulesReference = {};
    }

    /**
    *
    * @param {InteractContainer} interact
    * @param {string} command
    * @param {Array} args
    */
    async run(interact, command, args) { }

    init() {

    }

    startLoading(name = "Generic Module") {
        this.loadingTime = Date.now();
        //console.log("Loading module : " + name);
    }

    endLoading(name = "Generic Module") {
        //console.log("Module : " + name + " loaded. Took : " + ((Date.now() - this.loadingTime) / 1000) + " seconds.");
        this.isLoaded = true;
    }

    /**
     * 
     * @param {InteractContainer} interact
     * @param {string | Discord.MessageEmbed} msg
     * @param {string} usedCommand
     */
    async sendMessage(interact, msg, usedCommand) {
        try {
            if (msg != null && msg != "") {
                let msgCut = msg;
                while (msgCut.length > 2000 && !msg.fields) {
                    await interact.channel.send(msgCut.substring(0, 1999));
                    msgCut = msgCut.substring(1999);
                }
                msg = msgCut;

                // Discord js 13 fix
                if (msg.fields) {
                    msg = { embeds: [msg] };
                }

                let msgToReturn = await interact.reply(msg);

                // Handle tutorial
                let user = Globals.connectedUsers[interact.author.id];

                if (user) {
                    await user.tutorial.reactOnCommand(usedCommand, interact, user.lang);
                }

                return msgToReturn;
            }
        } catch (ex) {
            interact.author.send(ex.message).catch((e) => {
                console.log(ex);
            });
        }
        return null;
    }

    getToStrShort(stat, lang) {
        switch (stat) {
            // Principaux
            case "str":
                stat = "strength";
                break;
            case "int":
                stat = "intellect";
                break;
            case "con":
                stat = "constitution";
                break;
            case "dex":
                stat = "dexterity";
                break;

            // Secondaires

            case "cha":
                stat = "charisma";
                break;
            case "wis":
                stat = "wisdom";
                break;
            case "will":
                stat = "will";
                break;
            case "per":
                stat = "perception";
                break;
            case "luck":
                stat = "luck";
                break;
        }
        return stat;
    }

    tryParseRarity(rarity) {
        let rarityIndex = decodeURI(rarity.toLowerCase());
        if (Globals.raritiesByLang[rarityIndex]) {
            return Globals.raritiesByLang[rarityIndex];
        }
        return rarity;
    }

    tryParseType(type) {
        let typeIndex = decodeURI(type.toLowerCase());
        if (Globals.typesByLang[typeIndex]) {
            return Globals.typesByLang[typeIndex];
        }
        return type;
    }

    tryParseSubType(subtype) {
        let subtypeIndex = decodeURI(subtype.toLowerCase());
        if (Globals.subtypesByLang[subtypeIndex]) {
            return Globals.subtypesByLang[subtypeIndex];
        }
        return subtype;
    }

    /**
     * 
     * @param {string} value
     */
    tryParseYesNo(value) {
        if (value === "true" || value === "false") { return value };
        let valueIndex = decodeURI(value.toLowerCase());
        if (Globals.yesNoByLang[valueIndex] != null) {
            return Globals.yesNoByLang[valueIndex];
        }
        return true;
    }

    cmdToString(data, prefix = "::") {
        let str = "```apache\n" + "::" + Translator.getString(data.lang, "help_panel", "help") + "::\n";
        for (let category in data.commands) {
            str += "[" + category + "]\n";
            for (let command in data.commands[category]) {
                str += prefix + command + " : " + data.commands[category][command] + "\n";
            }
        }
        str += "\n" + Translator.getString(data.lang, "general", "page_out_of_x", [data.page, data.maxPage]) + "```"
        return str;
    }

    getEquipableIDType(string) {
        return Globals.equipableCorresponds[string] != null ? Globals.equipableCorresponds[string] : -1;
    }

    /**
     * 
     * @param {stirng} leaderboardName
     * @param {Number} page
     */
    async getLeaderBoard(leaderboardName, page, axios) {
        let routes = {
            "level": "/game/character/leaderboard/level/",
            "gold": "/game/character/leaderboard/gold/",
            "craftlevel": "/game/character/leaderboard/craft/level/",
            "wbattacks": "/game/worldbosses/leaderboard/attacks/",
            "wbdamage": "/game/worldbosses/leaderboard/damage/",
            "power": "/game/character/leaderboard/power/",
            "achievements": "/game/character/leaderboard/achievements/",
            "arena": "/game/character/leaderboard/arena/",
        };

        let route = routes[leaderboardName] != null ? routes[leaderboardName] : routes["arena"];

        return (await axios.get(route + page)).data;
    }

    /**
     * 
     * @param {InteractContainer} interact
     * @param {Array<any>} args
     * @param {boolean} defaultLeaderboard
     */
    async drawLeaderboard(interact, args, defaultLeaderboard) {
        let leaderboardName = args[0];
        let page = args[1] != null ? args[1] : "";

        if (args[0] && !args[1] && Number.isInteger(Number.parseInt(args[0]))) {
            page = args[0];
        } else if (!args[0]) {
            leaderboardName = defaultLeaderboard;
        }

        let data = await this.getLeaderBoard(leaderboardName, page, Globals.connectedUsers[interact.author.id].getAxios());
        /**
         *  @type {Leaderboard}
         **/
        let leaderboard;
        if (data.error == null) {
            switch (leaderboardName) {
                case "level":
                    leaderboard = new LeaderboardLevel(data);
                    break;
                case "gold":
                    leaderboard = new LeaderboardGold(data);
                    break;
                case "craftlevel":
                    leaderboard = new LeaderboardCraftLevel(data);
                    break;
                case "wbattacks":
                    leaderboard = new LeaderboardWBAttacks(data);
                    break;
                case "wbdamage":
                    leaderboard = new LeaderboardWBDamage(data);
                    break;
                case "power":
                    leaderboard = new LeaderboardPower(data);
                    break;
                case "achievements":
                    leaderboard = new LeaderboardAchievements(data);
                    break;
                case "arena":
                default:
                    leaderboard = new LeaderboardPvP(data);
                    break;
            }

            await this.pageListener(data, interact, leaderboard.draw(), async (currPage) => {
                return await this.getLeaderBoard(leaderboardName, currPage, Globals.connectedUsers[interact.author.id].getAxios())
            }, async (newData) => {
                leaderboard.load(newData);
                return leaderboard.draw();
            });

        } else {
            this.sendMessage(interact, data.error);
        }
    }

    /**
     * 
     * @param {Array} args
     */
    getSearchFilters(args) {
        let toReturn = { page: 1, params: {} };

        if (args.length > 0) {
            if (args.length % 2) {
                // Impair
                toReturn.page = args[args.length - 1];
                args = args.slice(0, args.length - 1);
            }

            for (let i = 0; i < args.length; i += 2) {
                let type = args[i];
                let value = args[i + 1];

                switch (type) {
                    case "rarity":
                        type = "idRarity";
                        value = this.tryParseRarity(value);
                        break;
                    case "type":
                        type = "idType";
                        value = this.tryParseType(value);
                        break;
                    case "subtype":
                        type = "idSousType";
                        value = this.tryParseSubType(value)
                        break;
                    case "level_up":
                        type = "level";
                        break;
                    case "power_up":
                        type = "power";
                        break;
                    case "rebirth_up":
                    case "rebirth_level_up":
                        type = "rebirth";
                        break;
                    case "rebirth_level_down":
                        type = "rebirth_down";
                        break;
                    case "fav":
                    case "favorite":
                        type = "fav";
                        value = this.tryParseYesNo(value);
                        break;
                }

                toReturn.params[type] = value;
            }


        }

        return toReturn;

    }

    /**
     * Callback for getting data from api
     * 
     * @callback dataCollectorCallback
     * @param {Number} currPage
     */

    /**
     * 
     * @param {{page: number, maxPage: number}} initialData
     * @param {InteractContainer} interact
     * @param {string | Discord.MessageEmbed} initialMessage
     * @param {dataCollectorCallback} dataCollectorCallback
     * @param {Function} afterCollectorCallback
     * @param {string} lang
     */
    async pageListener(initialData, interact, initialMessage, dataCollectorCallback, afterCollectorCallback, lang = "en") {
        var currentPage = initialData.page;
        let currentMessageReactions = [];

        let backEmoji = "back";
        let nextEmoji = "next";

        const buttonBack = new Discord.MessageButton()
            .setCustomId("back")
            .setLabel(Translator.getString(lang, "general", "back"))
            .setStyle("PRIMARY")
            .setEmoji(Emojis.getString("left_arrow"));

        const buttonNext = new Discord.MessageButton()
            .setCustomId("next")
            .setLabel(Translator.getString(lang, "general", "next"))
            .setStyle("PRIMARY")
            .setEmoji(Emojis.getString("right_arrow"));

        const buttonActionRow = new Discord.MessageActionRow();

        if (initialData.page > 1) {
            currentMessageReactions.push(backEmoji);
            buttonActionRow.addComponents(buttonBack);
        }
        if (initialData.page < initialData.maxPage) {
            currentMessageReactions.push(nextEmoji);
            buttonActionRow.addComponents(buttonNext);
        }

        const replyOptions = interact.getReplyOptions(initialMessage);
        replyOptions.components.push(buttonActionRow);

        let messageReactWrapper = new MessageReactionsWrapper();
        await messageReactWrapper.load(interact, replyOptions, { reactionsEmojis: currentMessageReactions, collectorOptions: { time: 60000 } });

        if (messageReactWrapper.message == null) {
            return;
        }

        messageReactWrapper.collector.on('collect',
            /**
             *
             * @param {Discord.ButtonInteraction} reaction
             */
            async (reaction, user) => {
                let dataCollector;
                let msgCollector = "";
                switch (reaction.customId) {
                    case nextEmoji:
                        currentPage++;
                        break;
                    case backEmoji:
                        currentPage--;
                        break;
                }

                dataCollector = await dataCollectorCallback(currentPage);                
                const buttonActionRow = new Discord.MessageActionRow();


                if (dataCollector.error == null) {
                    msgCollector = await afterCollectorCallback(dataCollector);
                    currentMessageReactions = [];
                    if (dataCollector.page > 1) {
                        currentMessageReactions.push(backEmoji);
                        buttonActionRow.addComponents(buttonBack);
                    }
                    if (dataCollector.page < dataCollector.maxPage) {
                        currentMessageReactions.push(nextEmoji);
                        buttonActionRow.addComponents(buttonNext);
                    }

                } else {
                    msgCollector = dataCollector.error;
                }

                const replyOptions = InteractContainer.getReplyOptions(msgCollector);
                replyOptions.components.push(buttonActionRow);

                await messageReactWrapper.edit(replyOptions, reaction, currentMessageReactions);
            });
    }


    /**
     * 
     * @param {InteractContainer} interact
     * @param {string | Discord.MessageEmbed} initialMessage
     * @param {dataCollectorCallback} dataCollectorCallback
     * @param {string} lang
     */
    async confirmListener(interact, initialMessage, dataCollectorCallback, lang = "en") {
        const replyOptions = interact.getReplyOptions(initialMessage);


        replyOptions.components.push(new Discord.MessageActionRow()
            .addComponents(
                MenusAndButtons.getConfirmButton(lang),
                MenusAndButtons.getCancelButton(lang)
            )
        );

        let messageReactWrapper = new MessageReactionsWrapper();
        await messageReactWrapper.load(interact, replyOptions, { reactionsEmojis: ["confirm", "cancel"], collectorOptions: { time: 30000, max: 1 } });

        if (messageReactWrapper.message == null) {
            return;
        }

        messageReactWrapper.collector.on('collect',
            /**
             * 
             * @param {Discord.ButtonInteraction} reaction
             */
            async (reaction) => {
                interact.interaction = reaction;
                let content = await dataCollectorCallback(reaction.customId == "confirm" ? true : false);
                if (content != null && content != "") {
                    await messageReactWrapper.deleteAndSend(content, interact);
                }
            }
        );



    }

    getBasicSuccessErrorMessage(axiosQueryResult) {
        let data = axiosQueryResult.data;
        let msg = "";
        if (data.error == null) {
            msg = data.success;
        } else {
            msg = data.error;
        }
        return msg;
    }

    async getDisplayIfSuccess(axiosQueryResult, callbackData, callbackError = null) {
        let data = axiosQueryResult.data ? axiosQueryResult.data : axiosQueryResult;
        let msg = "";
        if (data.error == null) {
            msg = await callbackData(data);
        } else {
            if (callbackError != null) {
                msg = await callbackError(data);
            } else {
                msg = data.error;
            }
        }
        return msg;
    }

}



module.exports = GModule;
