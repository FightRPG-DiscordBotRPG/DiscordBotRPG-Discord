const GModule = require("../GModule");
const Discord = require("discord.js");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const ItemShow = require("../../Drawings/ItemShow");
const Trade = require("../../Drawings/Trade");

class TradeModule extends GModule {
    constructor() {
        super();
        this.commands = ["tpropose", "tcancel", "taccept", "tshow", "titem", "tadd", "tremove", "tsetmoney", "tvalidate"];
        this.startLoading("Trade");
        this.init();
        this.endLoading("Trade");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let mentions = message.mentions.users;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;
        let firstMention = mentions.first();;
        let usernameToDoSomething = mentions.first() != null ? mentions.first().tag : args[0];

        switch (command) {
            case "tpropose":
                data = await axios.post("/game/trade/propose", {
                    mention: firstMention != null ? firstMention.id : null
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "taccept":
                data = await axios.post("/game/trade/accept");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tcancel":
                data = await axios.post("/game/trade/cancel");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tadd":
                data = await axios.post("/game/trade/item/add", {
                    idEmplacement: args[0],
                    number: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tremove":
                data = await axios.post("/game/trade/item/remove", {
                    idEmplacement: args[0],
                    number: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tvalidate":
                data = await axios.post("/game/trade/validate");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tsetmoney":
                data = await axios.post("/game/trade/money/set", {
                    number: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "tshow":
                data = await axios.get("/game/trade/show");
                data = data.data;
                if (data.error == null) {
                    let checkEmoji = Emojis.getID("vmark");
                    let xmarkEmoji = Emojis.getID("xmark");
                    let tempMsg = await message.channel.send(Trade.toString(data)).catch(() => null);

                    Promise.all([
                        tempMsg.react(checkEmoji),
                        tempMsg.react(xmarkEmoji)
                    ]).catch(() => null);

                    const filter = (reaction, user) => {
                        return [checkEmoji, xmarkEmoji].includes(reaction.emoji.id) && user.id === message.author.id;
                    };


                    const collected = await tempMsg.awaitReactions(filter, {
                        max: 1,
                        time: 25000
                    });
                    const reaction = collected.first();
                    if (reaction != null) {
                        switch (reaction.emoji.id) {
                            case checkEmoji:
                                this.run(message, "tvalidate", args);
                                break;

                            case xmarkEmoji:
                                this.run(message, "tcancel", args);
                                break;
                        }
                    }
                } else {
                    msg = data.error;
                }
                break;

            case "titem":
                data = await axios.get("/game/trade/item/show/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = ItemShow.showItem(data);
                } else {
                    msg = data.error;
                }
                break;

        }

        this.sendMessage(message, msg);
    }
}

module.exports = TradeModule;