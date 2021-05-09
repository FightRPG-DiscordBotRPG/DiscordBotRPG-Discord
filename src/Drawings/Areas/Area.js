const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Utils = require("../../Utils");
const User = require("../../Users/User");
const TextDrawings = require("../TextDrawings");
const Moment = require("moment");

class Area {
	constructor() {
		this.displayWeather = true;
		this.displayImage = true;
		this.type = "default";
	}

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
	toString(data, user) {
		let area = data.area;
		let lang = data.lang;
		let embed = new Discord.MessageEmbed()
			.setColor([0, 255, 0])
			.setAuthor(area.name + " (" + area.id  + ") | " + area.levels + " | " + Translator.getString(lang, "area", "owned_by", [area.owner]), area.image);

		if (this.displayWeather) {
			embed = this.embedWeather(data, user, embed);
		}

		if (this.displayImage) {
			embed = embed.setImage(area.image);
        }

		return embed.addField(Translator.getString(lang, "general", "description"), area.desc);
	}

	embedWeather(data, user, embed) {
		let area = data.area;
		let lang = data.lang;
		return embed.addField(Translator.getString(lang, "climates", "climate"), Translator.getString(lang, "climates", area.climate.climate.shorthand), true)
			.addField(Translator.getString(lang, "weather", "weather"), Emojis.getWeatherEmoji(area.climate.currentWeather.shorthand) + " " + Translator.getString(lang, "weather", area.climate.currentWeather.shorthand), true)
			.addField(Translator.getString(lang, "weather", "impact"), this.getWeatherBonusesPenalties(area.climate.currentWeather, lang))
			.addField(Translator.getString(lang, "weather", "time_before_ends"), this.getWeatherTimeLeft(area.climate.dateNextWeatherChange), true)
	}

	disableAll() {
		this.displayWeather = false;
		this.displayImage = false;
	}

	enableAll() {
		this.displayWeather = true;
		this.displayImage = true;
    }

	getWeatherTimeLeft(date) {
		return Emojis.general.stopwatch + " " + (Moment(date).diff(Moment(Date.now()), "hours") % 24).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (Moment(date).diff(Moment(Date.now()), "minutes") % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (Moment(date).diff(Moment(Date.now()), "seconds") % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
	}

	getWeatherBonusesPenalties(weather, lang = "en") {
		let str = "";
		let travelFatigue = 1 / weather.travelSpeed;
		let collectFatigue = 1 / weather.collectSpeed;
		let collectChances = weather.collectChances / 1;
		str += Emojis.general.horse_face + " " + Translator.getString(lang, "bonuses", "travel_tiredness") + ` ${Emojis.general.simple_left_to_right_arrow} ${Translator.getFormater(lang).format(Math.round(travelFatigue * 100))}% (x${Translator.getFormater(lang).format(travelFatigue.toFixed(2))})\n`;
		str += Emojis.general.gloves + " " + Translator.getString(lang, "bonuses", "harvest_tiredness") + ` ${Emojis.general.simple_left_to_right_arrow} ${Translator.getFormater(lang).format(Math.round(collectFatigue * 100))}% (x${Translator.getFormater(lang).format(collectFatigue.toFixed(2))})\n`;
		str += Emojis.general.seedling + " " + Translator.getString(lang, "bonuses", "collect_drop") + ` ${Emojis.general.simple_left_to_right_arrow} ${Translator.getFormater(lang).format(Math.round(collectChances * 100))}% (x${Translator.getFormater(lang).format(collectChances.toFixed(2))})`;
		return str;
	}

	bonusesListToStr(data) {
		let str = "```\n";
		str += Translator.getString(data.lang, "area", "bonus_list_header") + "\n\n";
		for (let bonus in data.bonuses) {
			str += bonus + " => " + data.bonuses[bonus] + "\n";
		}
		str += "```";
		return str;
	}

	/**
     * 
     * @param {any} data
     * @param {User} user
     */
	conquestToStr(data, user) {
		let lang = data.lang;

		let embed = new Discord.MessageEmbed()
			.setColor([0, 255, 0])
			.setAuthor(data.name + " | " + data.levels + " | " + Translator.getString(lang, "area", "owned_by", [data.owner]), data.image)
			.addField(Translator.getString(lang, "area", "conquest"), this.tournamentInfoToStr(data, user));

		return Utils.addBonusesToEmbed(data.bonuses, user, embed)
			.addField(Translator.getString(lang, "area", "area_progression"), this.statsAndLevelToStr(data, user));
	}

	/**
     * 
     * @param {any} data
     * @param {User} user
     */
	tournamentInfoToStr(data, user) {
		let tournamentInfo = data.tournament_info;
		let lang = data.lang;

		let lineBreaks = "\n";

		if (tournamentInfo.isStarted) {
			return Emojis.general.collision + " " + Translator.getString(lang, "area", "conquest_ongoing");
		}

		let langStr = lang.length > 2 ? lang : lang + "-" + lang.toUpperCase();

		let str = Translator.getString(lang, "area", "conquest_next", [new Date(tournamentInfo.startDate).toLocaleString(langStr) + " UTC", tournamentInfo.numberOfGuildEnrolled]);

		let splitted = str.split("\n");

		return "**" + splitted[0] + "**\n" + Emojis.general.stopwatch + " " + splitted[1] + lineBreaks + Emojis.emojisProd.user.string + " " + splitted[2];

	}

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
	statsAndLevelToStr(data, user) {
		let lang = data.lang;
		let str = "";
		str += Emojis.emojisProd.exp.string + " " + Translator.getString(lang, "area", "conquest_actual_level", [data.level]) + "\n";
		str += (data.statPoints > 0 ? Emojis.emojisProd.plussign.string : Emojis.general.clipboard) + " " + Translator.getString(lang, "area", "conquest_points_to_distribute", [data.statPoints]) + "\n";
		str += Emojis.emojisProd.gold_coins.string + " " + Translator.getString(lang, "area", "conquest_price_to_next_level", [data.price]) + "\n";
		return str;
	}
}

module.exports = Area;