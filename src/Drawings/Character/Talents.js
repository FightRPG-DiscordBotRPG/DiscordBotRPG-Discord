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
            .addField(Translator.getString(lang, "talents", "reachable_talents_ids"), reachableNodes.length > 0 ? reachableNodes.join(", ") : Translator.getString(lang, "general", "none"))
            .addField(Translator.getString(lang, "talents", "unlocked_skills"), data.unlockedSkills.join(", "))
            .addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.stats, {}, TextDrawings.statCompareTypes.talents, user, lang))
            .addField(Translator.getString(lang, "inventory_equipment", "secondaryAttributes"), TextDrawings.statsToString(data.secondaryStats, {}, TextDrawings.statCompareTypes.talents, user, lang))
            ;

        return embed;
    }

}

module.exports = new Talents();