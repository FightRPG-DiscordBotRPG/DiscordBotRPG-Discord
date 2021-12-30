const User = require("../../Users/User");
const moment = require("moment");
const Translator = require("../../Translator/Translator");
const { MessageEmbed } = require("discord.js");
const Utils = require("../../Utils");
const Emojis = require("../Emojis");
const Globals = require("../../Globals");

class GameEvent {

    constructor(data) {
        this.id = data.id;
        this.type = data.type;
        this.title = data.title;
        this.desc = data.desc;
        this.background = data.backgroundImage;
        this.icon = data.iconImage;
        this.occurence = data.occurence;
        this.length = data.length;
        this.startDate = data.startDate ? moment(data.startDate) : null;
        this.endDate = data.endDate ? moment(data.endDate) : null;
        this.isOngoing = data.ongoing;
        /**
         * @type {Object<string, {id: number, name: string, value: number}>}
         **/
        this.globalModifiers = data.globalModifiers;
        this.areasSpecificDrops = data.areasSpecificDrops;
        this.areasTypesDrops = data.areasTypesDrops;
        this.willFireAgain = data.willFireAgain;
    }

    /**
     * 
     * @param {User} user
     */
    toEmbed(user) {
        let lang = user.lang;

        let embed = new MessageEmbed()
            .setAuthor({ name: `${this.title}${this.isOngoing ? " - " + Translator.getString(lang, "events", "ongoing") : ""}${!this.willFireAgain ? " - " + Translator.getString(lang, "events", "wont_fire_again") : ""}`, iconURL: this.icon })
            .setImage(this.background)
            .setDescription(this.desc ? this.desc : Translator.getString(lang, "skills", "no_desc"));

        if (this.willFireAgain) {
            let startDate = Utils.dateToLocalizedString(this.startDate.toDate(), lang);

            if (this.isOngoing) {
                embed = embed.addField(Translator.getString(lang, "events", "started"), startDate, true);
                embed = embed.addField(Translator.getString(lang, "events", "ends"), Utils.dateToLocalizedString(this.endDate.toDate(), lang), true);
            } else {
                embed = embed.addField(Translator.getString(lang, "events", "starts"), startDate, true);
            }

            embed.addField(Translator.getString(lang, "events", "duration"), moment.duration(this.length * 60000).locale(lang).humanize());

        }

        // Add bonuses
        embed = Utils.addBonusesToEmbed(this.globalModifiers, user, embed);

        if (Object.values(this.areasSpecificDrops).length > 0) {
            embed.addField(Translator.getString(lang, "events", "specific_loot_area"), Utils.defaultSeparator);
            for (let areaName in this.areasSpecificDrops) {
                embed = embed.addField(areaName, this.getLootTableToDropNumber(this.areasSpecificDrops[areaName], lang), true);
            }

        }

        if (Object.values(this.areasTypesDrops).length > 0) {
            embed.addField(Translator.getString(lang, "events", "specific_loot_area_types"), Utils.defaultSeparator);
            for (let typeAreaName in this.areasTypesDrops) {
                embed = embed.addField(Emojis.getAreaTypeEmoji(typeAreaName) + " " + Translator.getString(lang, "area", typeAreaName), this.getLootTableToDropNumber(this.areasTypesDrops[typeAreaName], lang), true);
            }
        }

        return embed;
    }

    getLootTableToDropNumber(lootTable, lang = "en") {
        let arr = [];
        for (let idRarity in lootTable) {
            let nameRarity = Globals.getRarityName(idRarity);
            arr.push(Emojis.getRarityEmoji(nameRarity) + " " + Translator.getString(lang, "rarities", nameRarity) + " x" + lootTable[idRarity].length);
        }
        return arr.join(" ");
    }
}

module.exports = GameEvent;