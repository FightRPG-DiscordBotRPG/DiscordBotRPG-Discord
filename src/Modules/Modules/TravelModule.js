const GModule = require("../GModule");
const Discord = require("discord.js");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const Areas = require("../../Drawings/Areas");



class TravelModule extends GModule {
    constructor() {
        super();
        this.commands = ["area", "areas", "travel", "travelregion", "areaplayers", "region"];
        this.startLoading("Travel");
        this.init();
        this.endLoading("Travel");
    }

    async run(message, command, args) {
        let msg = "";
        let data;
        let authorIdentifier = message.author.id;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        // travel related
        let checkEmoji, xmarkEmoji, tempMsg;

        switch (command) {
            case "area":
                data = await axios.get("/game/travel/area");
                data = data.data;
                if (data.error == null) {
                    msg = Areas.toString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "areas":
            case "region":
                data = await axios.get("/game/travel/region");
                data = data.data;
                if (data.error == null) {
                    msg = Areas.regionToString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "travel":
                if (args[1] === "confirm") {
                    data = await axios.post("/game/travel/toarea/", {
                        idArea: args[0]
                    });
                    data = data.data;
                    if (data.error == null) {
                        msg = data.success;
                    } else {
                        msg = data.error;
                    }
                } else {
                    data = await axios.get("/game/travel/info/" + args[0]);
                    data = data.data;
                    if (data.error == null) {

                        checkEmoji = Emojis.getID("vmark");
                        xmarkEmoji = Emojis.getID("xmark");
                        tempMsg = await message.channel.send(this.getTravelMessage(data)).catch(() => null);

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
                                    data = await axios.post("/game/travel/toarea/", {
                                        idArea: args[0]
                                    });
                                    data = data.data;
                                    if (data.error == null) {
                                        msg = data.success;
                                    } else {
                                        msg = data.error;
                                    }

                                    break;

                                case xmarkEmoji:
                                    msg = Translator.getString(data.lang, "travel", "travel_cancel");
                                    break;
                            }
                        }
                        tempMsg.delete().catch(() => null);
                    } else {
                        msg = data.error;
                    }
                }
                break;

            case "travelregion":
                if (args[1] === "confirm") {
                    data = await axios.post("/game/travel/toregion/", {
                        idArea: args[0]
                    });
                    data = data.data;
                    if (data.error == null) {
                        msg = data.success;
                    } else {
                        msg = data.error;
                    }
                } else {
                    data = await axios.get("/game/travel/inforegion/" + args[0]);
                    data = data.data;
                    if (data.error == null) {

                        checkEmoji = Emojis.getID("vmark");
                        xmarkEmoji = Emojis.getID("xmark");
                        tempMsg = await message.channel.send(this.getTravelMessage(data)).catch(() => null);

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
                                    data = await axios.post("/game/travel/toregion/", {
                                        idArea: args[0]
                                    });
                                    data = data.data;
                                    if (data.error == null) {
                                        msg = data.success;
                                    } else {
                                        msg = data.error;
                                    }

                                    break;

                                case xmarkEmoji:
                                    msg = Translator.getString(data.lang, "travel", "travel_cancel");
                                    break;
                            }
                        }
                        tempMsg.delete().catch(() => null);
                    } else {
                        msg = data.error;
                    }
                }

                break;
            case "areaplayers":
                data = await axios.get("/game/travel/players/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = "```";
                    msg += Translator.getString(data.lang, "area", "list_of_players_in_area", [data.area_name]) + "\n\n";

                    for (let player of data.players) {
                        msg += Translator.getString(data.lang, "area", "player", [player.idCharacter, player.userName, player.actualLevel]) + "\n\n";
                    }

                    msg += "\n" + Translator.getString(data.lang, "general", "page") + " : " + data.page + " / " + data.maxPage;
                    msg += "```";
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }

    getTravelMessage(data) {
        let waitTimeMessage = data.realWaitTime != data.costs.timeToWait ? Translator.getString(data.lang, "travel", "wait_time_body_with_mount", [data.realWaitTime, data.costs.timeToWait - data.realWaitTime]) : Translator.getString(data.lang, "travel", "wait_time_body", [data.realWaitTime]);

        return new Discord.RichEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Emojis.getString("scroll") + " " + Translator.getString(data.lang, "travel", "travel_planning", [data.from_name, data.to_name]))
            .addField(Emojis.getString("hourglass_not_done") + " " + Translator.getString(data.lang, "travel", "wait_time_title"), waitTimeMessage, true)
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "travel", "gold_price_title"), Translator.getString(data.lang, "travel", "gold_price_body", [data.costs.goldPrice]), true)
            .addField(Emojis.getString("q_mark") + " " + Translator.getString(data.lang, "travel", "sure_to_travel_title"), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));
    }

}

module.exports = TravelModule;