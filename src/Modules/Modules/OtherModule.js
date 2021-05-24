const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Utils = require("../../Utils");


class OtherModule extends GModule {
    constructor() {
        super();
        this.commands = ["lang", "help", "settings", "rarities", "types", "vote"];
        this.startLoading("Other");
        this.init();
        this.endLoading("Other");
    }

    async run(message, command, args, prefix) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let user = Globals.connectedUsers[message.author.id];


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
                    this.pageListener(data, message, this.cmdToString(data, prefix), async (currPage) => {
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


                    let reactWrapper = new MessageReactionsWrapper();
                    await reactWrapper.load(message, tempMsgContent, {
                        reactionsEmojis: [one, two, three, four],
                        collectorOptions: {
                            max: 1,
                            time: 20000
                        }
                    });

                    reactWrapper.collector.on("collect", async (reaction) => {
                        switch (reaction.emoji.id || reaction.emoji.name) {
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
                            case five:
                                data = await axios.post("/game/other/settings", {
                                    mTrade: true,
                                });
                                break;
                        }

                        if (data != null) {
                            await this.sendMessage(message, this.getBasicSuccessErrorMessage(data));
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

        this.sendMessage(message, msg, command);
    }
}

module.exports = OtherModule;