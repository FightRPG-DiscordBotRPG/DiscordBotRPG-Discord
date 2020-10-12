const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../../Drawings/Emojis");
const TextDrawings = require("../TextDrawings");
const User = require("../../Users/User");

class Talents {

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let lang = data.lang;

        let reachableNodes = [];

        for (let item of data.talents) {
            for (let link of item.linkedNodes) {
                if (!reachableNodes.includes(link) && !data.talents.find(e => e.id == link)) {
                    reachableNodes.push(link);
                }
            }
        }

        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(lang, "talents", "header_talents"))
            .addField(Translator.getString(lang, "talents", "reachable_talents_ids"), reachableNodes.length > 0 ? Emojis.general.link + " " + reachableNodes.join(", ") : Translator.getString(lang, "general", "none"))
            .addField(Translator.getString(lang, "talents", "unlocked_skills"), data.unlockedSkills.length > 0 ? Emojis.general.open_book + " " + data.unlockedSkills.join(", ") : Translator.getString(lang, "general", "none"));

        if (this.isThereStats(data.stats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.stats, {}, TextDrawings.statCompareTypes.talents, user, lang));

        }

        if (this.isThereStats(data.secondaryStats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "secondaryAttributes"), TextDrawings.statsToString(data.secondaryStats, {}, TextDrawings.statCompareTypes.talents, user, lang));
        }


        return embed;
    }


    isThereStats(stats) {
        for (let statValue of Object.values(stats)) {
            if (statValue != 0) {
                return true;
            }
        }
        return false;
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    */
    showOne(data, user) {
        let lang = data.lang;
        let titleBonus, color;

        if (data.isAquired) {
            titleBonus = Translator.getString(lang, "general", "aquired");
            color = [128, 128, 128];
        } else if (data.unlockable) {
            titleBonus = Translator.getString(lang, "general", "unlockable");
            color = [0, 255, 0];
        } else {
            titleBonus = Translator.getString(lang, "general", "locked");
            color = [255, 0, 0];
        }

        this.isThereStats(data.node.secondaryStats);

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${data.node.id} - ${data.node.visuals.name} (${titleBonus})`, data.node.visuals.icon)
            .addField(Translator.getString(lang, "talents", "cost"), Emojis.general.target + " " + Translator.getString(lang, "talents", "x_point" + (data.node.realCost > 1 ? "" : "_plural"), [data.node.realCost]))
            .addField(Translator.getString(lang, "talents", "reachable_talents_ids"), data.node.linkedNodes.length > 0 ? Emojis.general.link + " " + data.node.linkedNodes.join(", ") : Translator.getString(lang, "general", "none"))
            .addField(Translator.getString(lang, "talents", "unlockable_skills"), data.node.skillsUnlockedNames.length > 0 ? Emojis.general.open_book + " " + data.node.skillsUnlockedNames.join(", ") : Translator.getString(lang, "general", "none"));


        if (this.isThereStats(data.node.stats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.node.stats, {}, TextDrawings.statCompareTypes.talents, user, lang));

        }

        if (this.isThereStats(data.node.secondaryStats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "secondaryAttributes"), TextDrawings.statsToString(data.node.secondaryStats, {}, TextDrawings.statCompareTypes.talents, user, lang));
        }

        return embed;
    }

}

module.exports = new Talents();