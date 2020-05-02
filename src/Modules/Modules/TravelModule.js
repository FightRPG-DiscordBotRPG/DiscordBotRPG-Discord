const GModule = require("../GModule");
const Discord = require("discord.js");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const Areas = require("../../Drawings/Areas");
const Axios = require("axios");



class TravelModule extends GModule {
    constructor() {
        super();
        this.commands = ["area", "areas", "travel", "travelregion", "areaplayers", "region", "traveldirect"];
        this.startLoading("Travel");
        this.init();
        this.endLoading("Travel");
    }

    async run(message, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "area":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/travel/area"), (data) => {
                    return Areas.toString(data);
                });
                break;

            case "areas":
            case "region":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/travel/region"), (data) => {
                    return Areas.regionToString(data);
                });
                break;

            case "travel":
                msg = await this.travelSharedCommand(message, args, axios, "area");
                break;

            case "travelregion":
                msg = await this.travelSharedCommand(message, args, axios, "region");
                break;

            case "traveldirect":
                msg = await this.travelSharedCommand(message, args, axios, "real");
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

        this.sendMessage(message, msg);
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
     * @param {Discord.Message} message
     * @param {Array} args
     * @param {string} type
     */
    async travelSharedCommand(message, args, axios, type = "area") {
        let msg = "";
        if (args[1] === "confirm") {
            msg = await this.travelPost(args, axios, type);
        } else {
            msg = await this.getDisplayIfSuccess(await this.travelGet(args, axios, type), async (data) => {
                await this.confirmListener(message, this.getTravelMessage(data), async (validate) => {
                    if (validate == true) {
                        return await this.travelPost(args, axios, type);
                    } else {
                        return Translator.getString(data.lang, "travel", "travel_cancel");
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