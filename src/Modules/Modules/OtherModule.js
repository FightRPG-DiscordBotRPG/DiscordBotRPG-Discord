const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Utils = require("../../Utils");
const InteractContainer = require("../../Discord/InteractContainer");
const Discord = require("discord.js");


class OtherModule extends GModule {
    constructor() {
        super();
        this.commands = ["lang", "help", "settings", "rarities", "types", "vote"];
        this.startLoading("Other");
        this.init();
        this.endLoading("Other");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args, prefix) {
        let msg = "";
        let authorIdentifier = interact.author.id;
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let user = Globals.connectedUsers[interact.author.id];


        switch (command) {
            case "lang":
                if (args[0]) {
                    msg = await this.getDisplayIfSuccess(await axios.post("/game/other/lang", {
                        lang: args[0],
                    }), (data) => {
                        Globals.connectedUsers[authorIdentifier].setLang(data.lang);
                        return data.success;
                    });
                } else {
                    msg = await this.getDisplayIfSuccess(await axios.get("/game/other/lang"), (data) => {
                        let str = Translator.getString(data.lang, "languages", "list_of_languages") + "\n";
                        let count = 0;
                        for (let i in data.languages) {
                            count++;
                            str += data.languages[i] + " (" + i + ")" + (count == Object.keys(data.languages).length ? "" : ", ");
                        }
                        return str;
                    });
                }
                break;
            case "help":
                msg = await this.getDisplayIfSuccess(Utils.getHelpPanel(user.lang, args[0]), (data) => {
                    this.pageListener(data, interact, this.cmdToString(data, prefix), async (currPage) => {
                        return Utils.getHelpPanel(user.lang, currPage);
                    }, async (newData) => {
                        return this.cmdToString(newData, prefix);
                    });
                });
                break;
            case "settings":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/other/settings"), async (data) => {

                    let one = Emojis.general.one;
                    let two = Emojis.general.two;
                    let three = Emojis.general.three;
                    let four = Emojis.general.four;
                    //let five = Emojis.general.five;
                    const list = [one, two, three, four];

                    let tempMsgContent = "**" + Translator.getString(data.lang, "settings_menu", "title") + "**\n\n" +
                        one + " : " + "`"
                        + Translator.getString(data.lang, "group", "settings_menu_mute", [(data.isGroupMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))]) + "`\n\n" +
                        two + " : "
                        + "`" + Translator.getString(data.lang, "marketplace", "settings_menu_mute", [(data.isMarketplaceMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))])
                        + "`\n\n" +
                        three + " : " + "`" + Translator.getString(data.lang, "fight_general", "settings_menu_mute", [(data.isFightMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))])
                        + "`\n\n" +
                        four + " : " + "`" + Translator.getString(data.lang, "world_bosses", "settings_menu_mute", [(data.isWorldBossesMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))])
                        + "`\n\n";

                    let options = InteractContainer.getReplyOptions(tempMsgContent);
                    let actionRow = new Discord.MessageActionRow();
                    for (let emoji of list) {
                        actionRow.addComponents(
                            new Discord.MessageButton()
                                .setCustomId(emoji)
                                .setLabel("")
                                .setStyle("SECONDARY")
                                .setEmoji(emoji)
                        );
                    }

                    options.components.push(actionRow);

                    let reactWrapper = new MessageReactionsWrapper();
                    await reactWrapper.load(interact, options, {
                        reactionsEmojis: list,
                        collectorOptions: {
                            max: 1,
                            time: 20000
                        }
                    });

                    reactWrapper.collector.on("collect",
                        /**
                         * 
                         * @param {Discord.ButtonInteraction} reaction
                         */
                        async (reaction) => {
                            switch (reaction.customId) {
                                case one:
                                    data = await axios.post("/game/other/settings", {
                                        mGroup: true,
                                    });
                                    break;
                                case two:
                                    data = await axios.post("/game/other/settings", {
                                        mMarket: true,
                                    });
                                    break;
                                case three:
                                    data = await axios.post("/game/other/settings", {
                                        mFight: true,
                                    });
                                    break;
                                case four:
                                    data = await axios.post("/game/other/settings", {
                                        mWorldBoss: true,
                                    });
                                    break;
                                    //case five:
                                    //    data = await axios.post("/game/other/settings", {
                                    //        mTrade: true,
                                    //    });
                            }

                            if (data != null) {
                                interact.interaction = reaction;
                                await this.sendMessage(interact, this.getBasicSuccessErrorMessage(data));
                            }
                        });

                });

                break;
            case "rarities":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/other/rarities"), (data) => {
                    let str = "";
                    for (let i of data.rarities) {
                        str += i.idRarity + " => " + i.rarityName + "\n";
                    }
                    return str;
                });
                break;

            case "types":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/other/types"), (data) => {
                    let str = "";
                    for (let i of data.types) {
                        str += i.idType + " => " + i.typeName + "\n";
                    }
                    return str;
                });
                break;

            case "vote":
                msg = "https://discordbots.org/bot/401421644968624129/vote"
                break;
        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = OtherModule;