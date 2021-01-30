const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Utils = require("../../Utils");
const User = require("../../Users/User");
const TextDrawings = require("../TextDrawings");
const Rebirth = require("./Rebirth");

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
        let authorTitle = data.username + "  " + Emojis.general.collision + " " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, user.avatar);

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
        return embed.addField(Emojis.general.q_mark + " " +Translator.getString(data.lang, "help_panel", "other_title"), GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.money_bag + " " + Translator.getString(data.lang, "character", "money"), Translator.getFormater(data.lang).format(data.money) + " G", true)
            .addField(Emojis.emojisProd.honor.string + " " + Translator.getString(data.lang, "character", "honor"), Translator.getFormater(data.lang).format(data.honor), true)
            .addField(Emojis.general.trophy + " " + Translator.getString(data.lang, "character", "achievement_count", [data.achievements.totalAchievementsEarned, data.achievements.totalAchievements]), Translator.getString(data.lang, "general", "points" + (data.achievements.totalPoints > 1 ? "_plur" : ""), [data.achievements.totalPoints]), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddCharacterResources(data, user, embed) {
        return embed.addField(Emojis.general.bar_chart + " " + Translator.getString(data.lang, "character", "character_resources"), GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.red_heart + " " +Translator.getString(data.lang, "character", "health_points"), TextDrawings.formatHealth(data.currentHp, data.maxHp, data.lang, 8, false, false), true)
            .addField(Emojis.general.water_droplet + " " + Translator.getString(data.lang, "character", "mana_points"), TextDrawings.formatMana(data.currentMp, data.maxMp, data.lang, 8, false, false), true)
            .addField(Emojis.general.high_voltage + " " + Translator.getString(data.lang, "character", "energy_points"), TextDrawings.formatEnergy(data.currentEnergy, data.maxEnergy, data.lang, 8, false, false), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddAttributes(data, user, embed) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let statsTitle = (data.statPoints > 0 ? Emojis.emojisProd.plussign.string : Emojis.emojisProd.user.string) + " " + Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);

        return embed.addField(statsTitle, GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.clipboard + " " + Translator.getString(data.lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.stats, Utils.add(data.talents.stats, data.statsEquipment), TextDrawings.statCompareTypes.character, user, data.lang), true)
            .addField(Emojis.general.clipboard + " " + Translator.getString(data.lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(data.secondaryStats, Utils.add(data.talents.secondaryStats, data.secondaryStatsEquipment), TextDrawings.statCompareTypes.only_total, user, data.lang), true);
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
        let titleXPFight = Emojis.emojisProd.level.string + " " + Translator.getString(data.lang, "character", "level") + ": " + data.level + "\n" + Emojis.emojisProd.rebirth.string + " " + Translator.getString(data.lang, "inventory_equipment", "rebirth_level") + ": " + data.rebirthLevel;

        if (Rebirth.getRebirthPossible(data.rebirthLevel, data.maxRebirthLevel, data.level, data.maxLevel, data.nextRebirthsLevelsModifiers?.requiredItems, user).canRebirth) {
            playerLevelDisplay.title += " " + Rebirth.getRebirthAvailabilityString(true, data.lang);
        }

        // Craft level title
        let playerCraftLevelDisplay = TextDrawings.formatLevelProgressBar(data.craft.xp, data.craft.xpNextLevel, data.craft.level, data.maxLevel, data.lang);
        let titleXPCraft = Emojis.general.hammer + " " + Translator.getString(data.lang, "character", "craft_level") + ": " + data.craft.level + "\n" + Emojis.emojisProd.rebirth.string + " " + Translator.getString(data.lang, "inventory_equipment", "rebirth_level") + ": " + data.craft.rebirthLevel;


        if (Rebirth.getRebirthPossible(data.craft.rebirthLevel, data.craft.maxRebirthLevel, data.craft.level, data.craft.maxLevel, data.craft?.nextRebirthsLevelsModifiers.requiredItems, user).canRebirth) {
            playerCraftLevelDisplay.title += " " + Rebirth.getRebirthAvailabilityString(true, data.lang);
        }




        embed = embed.addField(Emojis.emojisProd.exp.string + " " +Translator.getString(data.lang, "character", "character_advancement"), GenericMultipleEmbedList.getSeparator())
            .addField(titleXPFight, playerLevelDisplay.title + "\n" + playerLevelDisplay.bar, true)
            .addField(titleXPCraft, playerCraftLevelDisplay.title + "\n" + playerCraftLevelDisplay.bar, true);

        return embed;
    }

    disableAll() {
        this.displayAttributes = false;
        this.displayOther = false;
        this.displayResources = false;
        this.displayAdvancement = false;
    }
}

module.exports = InfoPanel;