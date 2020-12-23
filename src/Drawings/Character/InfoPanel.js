const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Utils = require("../../Utils");
const User = require("../../Users/User");
const TextDrawings = require("../TextDrawings");

class InfoPanel {
    constructor() {
        this.displayAttributes = true;
        this.displayResources = true;
        this.displayOther = true;
        this.displayAdvancement = true;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar);

        if (this.displayAttributes) {
            embed = this.embedInfoPanelAddAttributes(data, user, embed);
        }

        if (this.displayAdvancement) {
            embed = this.embedInfoPanelAddCharacterAdvancement(data, user, embed);
        }

        if (this.displayResources) {
            embed = this.embedInfoPanelAddCharacterResources(data, user, embed);
        }

        if (this.displayOther) {
            embed = this.embedInfoPanelAddOther(data, user, embed)
        }
        //.addField(Emojis.getString("shield") + " " + Translator.getString(data.lang, "character", "damage_reduction"), Translator.getFormater(data.lang).format(Math.round((data.stats.armor + data.statsEquipment.armor) / ((8 * (Math.pow(data.level, 2))) / 7 + 5) * .5 * 10000) / 100) + "%", true)
        //.addField(Emojis.getString("critical") + " " + Translator.getString(data.lang, "character", "critical_chance"), Translator.getFormater(data.lang).format(criticalChance) + "%", true)
        //.addField(Emojis.getString("stun") + " " + Translator.getString(data.lang, "character", "maximum_stun_chance"), Translator.getFormater(data.lang).format(maximumStunChance) + "%", true)
        return embed;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddOther(data, user, embed) {
        return embed.addField(Translator.getString(data.lang, "help_panel", "other_title"), GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "character", "money"), Translator.getFormater(data.lang).format(data.money) + " G", true)
            .addField(Emojis.getString("honor") + " " + Translator.getString(data.lang, "character", "honor"), Translator.getFormater(data.lang).format(data.honor), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddCharacterResources(data, user, embed) {
        return embed.addField(Translator.getString(data.lang, "character", "character_resources"), GenericMultipleEmbedList.getSeparator())
            .addField(Translator.getString(data.lang, "character", "health_points"), TextDrawings.formatHealth(data.currentHp, data.maxHp, data.lang), true)
            .addField(Translator.getString(data.lang, "character", "mana_points"), TextDrawings.formatMana(data.currentMp, data.maxMp, data.lang), true)
            .addField(Translator.getString(data.lang, "character", "energy_points"), TextDrawings.formatEnergy(data.currentEnergy, data.maxEnergy, data.lang), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddAttributes(data, user, embed) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);

        return embed.addField(statsTitle, GenericMultipleEmbedList.getSeparator())
            .addField(Translator.getString(data.lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(Utils.add(data.stats, data.talents.stats), data.statsEquipment, TextDrawings.statCompareTypes.character, user, data.lang) ,true)
            .addField(Translator.getString(data.lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(Utils.add(data.secondaryStats, data.talents.secondaryStats), data.secondaryStatsEquipment, TextDrawings.statCompareTypes.only_total, user, data.lang), true);
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    * @param {Discord.MessageEmbed} embed
    */
    embedInfoPanelAddCharacterAdvancement(data, user, embed) {
        // Player level title
        let playerLevelDisplay = TextDrawings.formatLevelProgressBar(data.actualXp, data.xpNextLevel, data.level, data.maxLevel, data.lang);
        let titleXPFight = Translator.getString(data.lang, "character", "level") + ": " + data.level;
        // Craft level title
        let playerCraftLevelDisplay = TextDrawings.formatLevelProgressBar(data.craft.xp, data.craft.xpNextLevel, data.craft.level, data.craft.maxLevel, data.lang);
        let titleXPCraft = Translator.getString(data.lang, "character", "craft_level") + ": " + data.craft.level ;

        return embed.addField(Translator.getString(data.lang, "character", "character_advancement"), GenericMultipleEmbedList.getSeparator())
            .addField(titleXPFight, playerLevelDisplay.title + "\n" + playerLevelDisplay.bar, true)
            .addField(titleXPCraft, playerCraftLevelDisplay.title + "\n" + playerCraftLevelDisplay.bar, true);
    }

    disableAll() {
        this.displayAttributes = false;
        this.displayOther = false;
        this.displayResources = false;
        this.displayAdvancement = false;
    }
}

module.exports = InfoPanel;