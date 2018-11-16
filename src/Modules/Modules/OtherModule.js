const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");


class OtherModule extends GModule {
    constructor() {
        super();
        this.commands = ["lang", "help", "settings"];
        this.startLoading("Other");
        this.init();
        this.endLoading("Other");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();


        switch (command) {
            case "lang":
                if (args[0]) {
                    data = await axios.post("/game/other/lang", {
                        lang: args[0],
                    });
                    data = data.data;
                    if (data.error == null) {
                        msg = data.success;
                    } else {
                        msg = data.error;
                    }
                } else {
                    data = await axios.get("/game/other/lang");
                    data = data.data;
                    if (data.error == null) {
                        msg = Translator.getString(data.lang, "languages", "list_of_languages") + "\n";
                        let count = 0;
                        for (let i in data.languages) {
                            count++;
                            msg += data.languages[i] + " (" + i + ")" + (count == Object.keys(data.languages).length ? "" : ", ");
                        }
                    } else {
                        msg = data.error;
                    }
                }
                break;
            case "help":
                data = await axios.get("/game/other/help/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = this.cmdToString(data);
                } else {
                    msg = data.error;
                }
                break;
            case "settings":
                data = await axios.get("/game/other/settings");
                data = data.data;

                if (data.error == null) {
                    let one = Emojis.getString("one");
                    let two = Emojis.getString("two");
                    let tempMsgContent = "**" + Translator.getString(data.lang, "settings_menu", "title") + "**\n\n" +
                        one + " : " + "`" + Translator.getString(data.lang, "group", "settings_menu_mute", [(data.isGroupMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))]) + "`\n\n" +
                        two + " : " + "`" + Translator.getString(data.lang, "marketplace", "settings_menu_mute", [(data.isMarketplaceMuted ? Translator.getString(data.lang, "general", "enable") : Translator.getString(data.lang, "general", "disable"))]) + "`\n\n";
                    let tempMsg = await message.channel.send(tempMsgContent).catch(() => null);

                    await Promise.all([
                        tempMsg.react(one),
                        tempMsg.react(two)
                    ]).catch(() => null);

                    const filter = (reaction, user) => {
                        return [one, two].includes(reaction.emoji.id || reaction.emoji.name) && user.id === message.author.id;
                    };

                    const collected = await tempMsg.awaitReactions(filter, {
                        max: 1,
                        time: 20000
                    });
                    const reaction = collected.first();
                    if (reaction != null) {
                        switch (reaction.emoji.id || reaction.emoji.name) {
                            case one:
                                data = await axios.post("/game/other/settings", {
                                    mGroup: true,
                                });
                                data = data.data;
                                if (data.error == null) {
                                    msg = data.success;
                                } else {
                                    msg = data.error;
                                }
                                break;
                            case two:
                                data = await axios.post("/game/other/settings", {
                                    mMarket: true,
                                });
                                data = data.data;
                                if (data.error == null) {
                                    msg = data.success;
                                } else {
                                    msg = data.error;
                                }
                                break;
                        }
                    }
                    tempMsg.delete().catch(() => null);
                } else {
                    msg = data.error;
                }


                break;
        }

        this.sendMessage(message, msg);
    }

    cmdToString(data) {
        let str = "```apache\n" + "::" + Translator.getString(data.lang, "help_panel", "help") + "::\n";
        for (let category in data.commands) {
            str += "[" + category + "]\n";
            for (let command in data.commands[category]) {
                str += "::" + command + " : " + data.commands[category][command] + "\n";
            }
        }
        str += "\n" + Translator.getString(data.lang, "general", "page_out_of_x", [data.page, data.maxPage]) + "```"
        return str;
    }
}

module.exports = OtherModule;