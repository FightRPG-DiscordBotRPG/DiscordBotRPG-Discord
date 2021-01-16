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

class GModule {
    constructor() {
        this.isReloadable = true;
        this.loadingTime = 0;
        this.isModule = true;
        this.isLoaded = false;
        this.isActive = true;
        this.commands = [];
        this.allModulesReference = {};
    }

    /**
    *
    * @param {Discord.Message} message
    * @param {string} command
    * @param {Array} args
    */
    async run(message, command, args) { }

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
     * @param {Discord.Message} message
     * @param {string} msg
     */
    async sendMessage(message, msg) {
        try {
            if (msg != null && msg != "") {
                let msgCut = msg;
                while (msgCut.length > 2000) {
                    await message.channel.send(msgCut.substring(0, 1999));
                    msgCut = msgCut.substring(1999);
                }
                msg = msgCut;
                return await message.channel.send(msg);
            }
        } catch (ex) {
            message.author.send(ex.message).catch((e) => {
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
     * @param {Discord.Message} message
     * @param {Array<any>} args
     * @param {boolean} defaultLeaderboard
     */
    async drawLeaderboard(message, args, defaultLeaderboard) {
        let leaderboardName = args[0];
        let page = args[1] != null ? args[1] : "";

        if (args[0] && !args[1] && Number.isInteger(Number.parseInt(args[0]))) {
            page = args[0];
        } else if (!args[0]) {
            leaderboardName = defaultLeaderboard;
        }

        let data = await this.getLeaderBoard(leaderboardName, page, Globals.connectedUsers[message.author.id].getAxios());
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

            await this.pageListener(data, message, leaderboard.draw(), async (currPage) => {
                return await this.getLeaderBoard(leaderboardName, currPage, Globals.connectedUsers[message.author.id].getAxios())
            }, async (newData) => {
                leaderboard.load(newData);
                return leaderboard.draw();
            });

        } else {
            this.sendMessage(message, data.error);
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
     * @param {Discord.Message} messageDiscord
     * @param {string | Discord.MessageEmbed} initialMessage
     * @param {dataCollectorCallback} dataCollectorCallback
     * @param {Function} afterCollectorCallback
     */
    async pageListener(initialData, messageDiscord, initialMessage, dataCollectorCallback, afterCollectorCallback) {
        var currentPage = initialData.page;
        let currentMessageReactions = [];

        let nextEmoji = Emojis.getString("right_arrow");
        let backEmoji = Emojis.getString("left_arrow");

        if (initialData.page > 1) {
            currentMessageReactions.push(backEmoji);
        }
        if (initialData.page < initialData.maxPage) {
            currentMessageReactions.push(nextEmoji);
        }

        let messageReactWrapper = new MessageReactionsWrapper();
        await messageReactWrapper.load(messageDiscord, initialMessage, { reactionsEmojis: currentMessageReactions, collectorOptions: { time: 60000 } });


        if (messageReactWrapper.message == null) {
            return;
        }

        messageReactWrapper.collector.on('collect', async (reaction, user) => {
            let dataCollector;
            let msgCollector = "";
            switch (reaction.emoji.name) {
                case nextEmoji:
                    currentPage++;
                    break;
                case backEmoji:
                    currentPage--;
                    break;
            }

            dataCollector = await dataCollectorCallback(currentPage);

            if (dataCollector.error == null) {
                msgCollector = await afterCollectorCallback(dataCollector)

                currentMessageReactions = [];
                if (dataCollector.page > 1) {
                    currentMessageReactions.push(backEmoji);
                }
                if (dataCollector.page < dataCollector.maxPage) {
                    currentMessageReactions.push(nextEmoji);
                }

            } else {
                msgCollector = dataCollector.error;
            }

            await messageReactWrapper.edit(msgCollector, currentMessageReactions);
        });
    }


    /**
     * 
     * @param {Discord.Message} messageDiscord
     * @param {string | Discord.MessageEmbed} initialMessage
     * @param {dataCollectorCallback} dataCollectorCallback
     * @param {Function} afterCollectorCallback
     */
    async confirmListener(messageDiscord, initialMessage, dataCollectorCallback) {
        let vmark = Emojis.general.vmark, xmark = Emojis.general.xmark;

        let currentMessageReactions = [vmark, xmark];

        let messageReactWrapper = new MessageReactionsWrapper();
        await messageReactWrapper.load(messageDiscord, initialMessage, { reactionsEmojis: currentMessageReactions, collectorOptions: { time: 30000, max: 1 } });

        if (messageReactWrapper.message == null) {
            return;
        }

        messageReactWrapper.collector.on('collect', async (reaction) => {
            await messageReactWrapper.deleteAndSend(await dataCollectorCallback(reaction.emoji.name == vmark ? true : false));
        });
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
        let data = axiosQueryResult.data;
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
