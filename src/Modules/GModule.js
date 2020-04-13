const Globals = require("../Globals");
const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const Leaderboard = require("../Drawings/Leaderboard/Leaderboard");
const LeaderboardWBAttacks = require("../Drawings/Leaderboard/LeaderboardWBAttacks");
const LeaderboardWBDamage = require("../Drawings/Leaderboard/LeaderboardWBDamage");
const LeaderboardPvP = require("../Drawings/Leaderboard/LeaderboardPvP");
const LeaderboardLevel = require("../Drawings/Leaderboard/LeaderboardLevel");
const LeaderboardGold = require("../Drawings/Leaderboard/LeaderboardGold");
const LeaderboardCraftLevel = require("../Drawings/Leaderboard/LeaderboardCraftLevel");
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

    async run() { }

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
                return await message.channel.send(msg);
            }
        } catch (ex) {
            message.author.send(error.message).catch((e) => {
                console.log(e);
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
        let rarityIndex = decodeURI(rarity.toLowerCase())
        if (Globals.raritiesByLang[rarityIndex]) {
            return Globals.raritiesByLang[rarityIndex];
        }
        return rarity;
    }

    tryParseType(type) {
        let typeIndex = decodeURI(type.toLowerCase())
        if (Globals.typesByLang[typeIndex]) {
            return Globals.typesByLang[typeIndex];
        }
        return type;
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
        let data;
        switch (leaderboardName) {
            case "level":
                data = await axios.get("/game/character/leaderboard/level/" + page);
                break;
            case "gold":
                data = await axios.get("/game/character/leaderboard/gold/" + page);
                break;
            case "craftlevel":
                data = await axios.get("/game/character/leaderboard/craft/level/" + page);
                break;
            case "wbattacks":
                data = await axios.get("/game/worldbosses/leaderboard/attacks");
                break;
            case "wbdamage":
                data = await axios.get("/game/worldbosses/leaderboard/damage");
                break;
            default:
            case "arena":
                data = await axios.get("/game/character/leaderboard/arena/" + page);
                break;
        }

        return data.data;
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
                default:
                case "arena":
                    leaderboard = new LeaderboardPvP(data);
                    break;
            }

            var currentPage = data.page;
            let currentMessageReactions = [];

            let nextEmoji = Emojis.getString("right_arrow");
            let backEmoji = Emojis.getString("left_arrow");

            if (data.page > 1) {
                currentMessageReactions.push(backEmoji);
            }
            if (data.page < data.maxPage) {
                currentMessageReactions.push(nextEmoji);
            }

            let messageReactWrapper = new MessageReactionsWrapper();
            await messageReactWrapper.load(message, leaderboard.drawWithPages(), { reactionsEmojis: currentMessageReactions, collectorOptions: { time: 60000 } });


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

                dataCollector = await this.getLeaderBoard(leaderboardName, currentPage, Globals.connectedUsers[message.author.id].getAxios());

                if (dataCollector.error == null) {
                    leaderboard.load(dataCollector);
                    msgCollector = leaderboard.drawWithPages();

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

        } else {
            this.sendMessage(message, data.error);
        }
    }



}



module.exports = GModule;
