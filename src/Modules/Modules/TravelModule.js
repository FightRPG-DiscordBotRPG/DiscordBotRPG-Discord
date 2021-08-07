const GModule = require("../GModule");
const Discord = require("discord.js");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const Axios = require("axios");
const Region = require("../../Drawings/Areas/Region");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const InteractContainer = require("../../Discord/InteractContainer");



class TravelModule extends GModule {
    constructor() {
        super();
        this.commands = ["area", "areas", "travel", "travelregion", "areaplayers", "region", "traveldirect"];
        this.startLoading("Travel");
        this.init();
        this.endLoading("Travel");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let user = Globals.connectedUsers[interact.author.id];

        switch (command) {
            case "area":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/travel/area"), async (data) => {

                    let area = user.getAreaDisplay(data);

                    let displayWeatherEmoji = Emojis.general.cloud;
                    let displayMonstersEmoji = Emojis.emojisProd.monster;
                    let displayResourcesEmoji = Emojis.emojisProd.item_type_resource;
                    let displayImageEmoji = Emojis.general.framed_picture;
                    let resetDisplaysEmoji = Emojis.general.counterclockwise_arrows_button;

                    let emojisList = [displayWeatherEmoji, displayImageEmoji];

                    let isWildArea = area.type === "WildArea";

                    if (isWildArea) {
                        emojisList = [...emojisList, ...[displayMonstersEmoji, displayResourcesEmoji]];
                    }

                    // It's here because i want it to be at the end of the array
                    emojisList.push(resetDisplaysEmoji);

                    let reactWrapper = new MessageReactionsWrapper();

                    await reactWrapper.load(interact, area.toString(data, user), {
                        reactionsEmojis: emojisList,
                        collectorOptions: {
                            time: 40000,
                        }
                    });

                    await user.tutorial.reactOnCommand("area", interact, user.lang);


                    reactWrapper.collector.on('collect', async (reaction) => {
                        switch (reaction.emoji.name) {
                            case displayWeatherEmoji:
                                area.displayWeather = !area.displayWeather;
                                break;
                            case displayImageEmoji:
                                area.displayImage = !area.displayImage;
                                break;
                            case resetDisplaysEmoji:
                                area.enableAll();
                                break;
                        }


                        if (isWildArea) {
                            switch (reaction.emoji.id) {
                                case displayMonstersEmoji.id:
                                    area.displayMonsters = !area.displayMonsters;
                                    break;
                                case displayResourcesEmoji.id:
                                    area.displayResources = !area.displayResources;
                                    break;
                            }

                        }


                        await reactWrapper.edit(area.toString(data, user), emojisList);
                    });

                });
                break;

            case "areas":
            case "region":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/travel/region"), (data) => {
                    return Region.toString(data);
                });
                break;

            case "travel":
                msg = await this.travelSharedCommand(interact, args, axios, "area");
                // For tutorial
                await user.tutorial.reactOnCommand(command, interact, user.lang);
                break;

            case "travelregion":
                msg = await this.travelSharedCommand(interact, args, axios, "region");
                // For tutorial
                await user.tutorial.reactOnCommand(command, interact, user.lang);
                break;

            case "traveldirect":
                msg = await this.travelSharedCommand(interact, args, axios, "real");
                break;

            case "areaplayers":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/travel/players/" + args[0]), (data) => {
                    let str = "```";
                    str += Translator.getString(data.lang, "area", "list_of_players_in_area", [data.area_name]) + "\n\n";

                    for (let player of data.players) {
                        str += Translator.getString(data.lang, "area", "player", [player.idCharacter, player.userName, player.actualLevel]) + "\n\n";
                    }

                    str += "\n" + Translator.getString(data.lang, "general", "page") + " : " + data.page + " / " + data.maxPage;
                    str += "```";
                    return str;
                });
                break;
        }

        this.sendMessage(interact, msg, command);
    }

    getTravelMessage(data) {
        let waitTimeMessage = data.realWaitTime != data.costs.timeToWait ? Translator.getString(data.lang, "travel", "wait_time_body_with_mount", [data.realWaitTime, data.costs.timeToWait - data.realWaitTime]) : Translator.getString(data.lang, "travel", "wait_time_body", [data.realWaitTime]);

        let weatherImpacts = "";

        let weathersChanges = data.costs.timeChangeDueToWeather.weathersChanges;
        let weathersChangesKeys = Object.keys(weathersChanges);
        let i = 1;

        for (let key of weathersChangesKeys) {

            let addedTime = weathersChanges[key];

            if (addedTime > 0) {
                weatherImpacts += Emojis.getWeatherEmoji(key) + Translator.getString(data.lang, "weather", key) + " " + Emojis.getString("simple_left_to_right_arrow") + " +" + Translator.getString(data.lang, "travel", "wait_time_body", [data.costs.timeChangeDueToWeather.weathersChanges[key]]);

                if (i < weathersChangesKeys.length) {
                    weatherImpacts += "\n";
                }
            }
        }


        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Emojis.general.scroll + " " + Translator.getString(data.lang, "travel", "travel_planning", [data.from_name, data.to_name]))
            .addField(Emojis.general.hourglass_not_done + " " + Translator.getString(data.lang, "travel", "wait_time_title"), waitTimeMessage, true)
            .addField(Emojis.general.money_bag + " " + Translator.getString(data.lang, "travel", "gold_price_title"), Translator.getString(data.lang, "travel", "gold_price_body", [data.costs.goldPrice]), true)
            .addField(Emojis.general.sunrise_over_the_mountain + " " + Translator.getString(data.lang, "weather", "impact") + " (" + Translator.getString(data.lang, "travel", "wait_time_body", [data.costs.timeChangeDueToWeather.totalTimeAddedDueToWeather]) + ")", weatherImpacts != "" ? weatherImpacts : Translator.getString(data.lang, "general", "none"))
            .addField(Emojis.general.stopwatch + " " + Translator.getString(data.lang, "travel", "total_without_weather"), Translator.getString(data.lang, "travel", "wait_time_body", [data.costs.timeToWait - data.costs.timeChangeDueToWeather.totalTimeAddedDueToWeather]))
            .addField(Emojis.general.q_mark + " " + Translator.getString(data.lang, "travel", "sure_to_travel_title"), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));
    }

    /**
     * 
     * @param {InteractContainer} interact
     * @param {Array} args
     * @param {string} type
     */
    async travelSharedCommand(interact, args, axios, type = "area") {
        let msg = "";
        if (args[1] === "confirm") {
            msg = await this.travelPost(args, axios, type);
        } else {
            msg = await this.getDisplayIfSuccess(await this.travelGet(args, axios, type), async (data) => {
                await this.confirmListener(interact, this.getTravelMessage(data), async (validate) => {
                    if (validate == true) {
                        return await this.travelPost(args, axios, type);
                    } else {
                        let easterEgg = "";
                        if (Math.random() < 0.001) {
                            easterEgg = "_easter_egg";
                        }
                        return Translator.getString(data.lang, "travel", "travel_cancel" + easterEgg);
                    }
                });
            });
        }
        return msg;
    }

    /**
     * 
     * @param {Array} args
     * @param {Axios.default} axios
     * @param {any} type
     */
    async travelGet(args, axios, type = "area") {
        switch (type) {
            case "area":
                return await axios.get("/game/travel/info/" + args[0]);
            case "region":
                return await axios.get("/game/travel/inforegion/" + args[0]);
            case "real":
            default:
                return await axios.get("/game/travel/info/" + args[0], {
                    params: {
                        isRealId: true
                    }
                });
        }
    }

    async travelPost(args, axios, type = "area") {
        let data;
        switch (type) {
            case "area":
                data = await axios.post("/game/travel/toarea/", {
                    idArea: args[0]
                });
                break;
            case "region":
                data = await axios.post("/game/travel/toregion/", {
                    idArea: args[0]
                });
                break;
            case "real":
            default:
                data = await axios.post("/game/travel/toarea/", {
                    idArea: args[0],
                    isRealId: true
                });
        }
        return this.getBasicSuccessErrorMessage(data);
    }

}

module.exports = TravelModule;