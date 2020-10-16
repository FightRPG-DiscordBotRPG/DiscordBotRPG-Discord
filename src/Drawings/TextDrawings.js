const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBars/ProgressBar");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Color = require("./Color");
const User = require("../Users/User");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const Utils = require("../Utils");

class TextDrawings {

    statCompareTypes = {
        "character": 0,
        "item": 1,
        "talents": 2,
        "only_total": 3,
    }

    /**
     * 
     * @param {any} stats
     * @param {any} compareStats
     * @param {number} type
     * @param {User} user
     * @param {string} lang
     */
    statsToString(stats, compareStats, type, user, lang) {
        let str = "";
        let totalSpaces = 36;
        let noStats = true;
        let maximumStatLength = 0;
        compareStats = compareStats != undefined ? compareStats : {};

        if (type !== this.statCompareTypes.item) {
            maximumStatLength = this.getBiggestStatLength(stats, compareStats);
        }

        for (let stat in stats) {
            if (type !== this.statCompareTypes.item || (type === this.statCompareTypes.item && stats[stat] !== 0) || (type === this.statCompareTypes.item && compareStats[stat])) {
                let compareEmoji = "";
                let diff = "";
                let end = "";

                //Used for character stats
                let totalStat = "";

                switch (type) {
                    case this.statCompareTypes.item:
                        if (!isNaN(compareStats[stat])) {
                            let diffNumber = (stats[stat] - compareStats[stat]);
                            diff = " -> " + diffNumber;

                            if (diffNumber > 0) {
                                compareEmoji = Emojis.emojisProd.levelup.string;
                            }
                            else if (diffNumber < 0) {
                                compareEmoji = Emojis.emojisProd.leveldown.string;
                            } else {
                                compareEmoji = Emojis.emojisProd.nochange.string;
                            }
                        } else {
                            diff = " -> 0";
                            compareEmoji = Emojis.emojisProd.nochange.string;
                        }
                        break;
                    case this.statCompareTypes.character:
                    case this.statCompareTypes.only_total:
                        if (stat !== "armor") {
                            diff = "+" + compareStats[stat].toString();
                        } else {
                            // Setting stats[armor] at total stat value 
                            stats[stat] = compareStats[stat];
                            compareStats[stat] = 0;
                        }

                        totalStat = (stats[stat] + compareStats[stat]);
                        totalStat = this.getStatString(stat, totalStat);

                        totalStat = " " + " ".repeat(1 + user.isOnMobile ? (maximumStatLength - totalStat.length) : 0) + totalStat;

                        break;

                }



                let beforeNumber = "";
                let statStr = "";
                let statLocalized = Translator.getString(lang, "stats", stat);
                let strStatWithDiff = "";


                // No more [x+x] xxx with the else
                if (type !== this.statCompareTypes.only_total) {
                    statStr = stats[stat].toString();
                    strStatWithDiff = "[" + stats[stat] + diff + "]";
                } else {
                    diff = "";
                }

                let nbrChar = statLocalized.length + 3 + diff.length;
                let lessSpaces = 1;

                let quote = "";
                if (user.isOnMobile && type === this.statCompareTypes.item) {
                    end = "\n\n";
                    quote = " ";
                    statLocalized = "**" + statLocalized + "**";
                } else {

                    if (user.isOnMobile) {
                        totalSpaces = 29
                    }

                    lessSpaces = totalSpaces - nbrChar - (4 + statStr.length);
                    end = "\n";
                    quote = "`";
                }
                beforeNumber += " ".repeat(lessSpaces <= 0 ? 1 : lessSpaces);

                

                let strToAdd = Emojis.stats[stat] + quote + statLocalized + beforeNumber + strStatWithDiff  + totalStat + quote + " " + compareEmoji + end;

                if (type === this.statCompareTypes.talents) {
                    if (stats[stat] !== 0) {
                        str += strToAdd;
                        noStats = false;
                    }
                } else {
                    str += strToAdd;
                    noStats = false;
                }

            }

        }
        if (noStats) {
            let noStatText = "";

            if (type === this.statCompareTypes.item) {
                noStatText = Translator.getString(lang, "inventory_equipment", "item_no_stats");
            } else {
                noStatText = Translator.getString(lang, "general", "none");
            }


            str += "`" + noStatText + "`";
        }


        return str;
    }

    getBiggestStatLength(stats, compareStats) {
        let length = 0;
        for (let i in stats) {
            let totalStat = (stats[i] + (compareStats[i] != null ? compareStats[i] : 0));
            totalStat = this.getStatString(i, totalStat);
            if (totalStat.length > length) {
                length = totalStat.length;
            }
        }

        return length;
    }


    getStatString(statName, statValue) {
        console.log(statName + " => " + statValue);
        if (statName.includes("Resist")) {
            return (statValue > 50 ? 50 : statValue) + "%";
        } else if (statName.includes("Rate")) {
            return (statValue < 0 ? 0 : statValue) + "%";
        } else if (statName.includes("Cost")) {
            return -statValue + "%";
        } else {
            return statValue.toString();
        }
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    userInfoPanel(data, user) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let healthBar = new ProgressBarHealth().draw(data.currentHp, data.maxHp);

        // Player level title
        let playerLevelDisplay = this.formatLevelProgressBar(data.actualXp, data.xpNextLevel, data.level, data.maxLevel, data.lang);
        let titleXPFight = Translator.getString(data.lang, "character", "level") + ": " + data.level + "\n" + playerLevelDisplay.title + " ";
        // Craft level title
        let playerCraftLevelDisplay = this.formatLevelProgressBar(data.craft.xp, data.craft.xpNextLevel, data.craft.level, data.craft.maxLevel, data.lang);
        let titleXPCraft = Translator.getString(data.lang, "character", "craft_level") + ": " + data.craft.level + "\n" + playerCraftLevelDisplay.title + " ";

        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);


        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar)
            .addField(statsTitle, this.statsToString(Utils.add(data.stats, data.talents.stats) , data.statsEquipment, this.statCompareTypes.character, user, data.lang))
            .addField(Translator.getString(data.lang, "inventory_equipment", "secondary_attributes"), this.statsToString(Utils.add(data.secondaryStats, data.talents.secondaryStats), data.secondaryStatsEquipment, this.statCompareTypes.only_total, user, data.lang))
            .addField(titleXPFight, playerLevelDisplay.bar, true)
            .addField(titleXPCraft, playerCraftLevelDisplay.bar, true)
            .addField(Translator.getString(data.lang, "character", "health_points"), this.formatHealth(data.currentHp, data.maxHp, data.lang ), !user.isOnMobile)
            .addField(Translator.getString(data.lang, "character", "mana_points"), this.formatMana(data.currentMp, data.maxMp, data.lang), !user.isOnMobile)
            .addField(Translator.getString(data.lang, "character", "energy_points"), this.formatEnergy(data.currentEnergy, data.maxEnergy, data.lang), !user.isOnMobile)
            .addField("Other Informations", GenericMultipleEmbedList.getSeparator())
            //.addField(Emojis.general. + " " + Translator.getString(data.lang, "character", "health_points") + "\n" + this.formatMinMax(data.currentHp, data.maxHp, data.lang), healthBar)
            //.addField(Emojis.getString("red_heart") + " " + Translator.getString(data.lang, "character", "health_points") + "\n" + this.formatMinMax(data.currentHp, data.maxHp, data.lang), healthBar)
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "character", "money"), Translator.getFormater(data.lang).format(data.money) + " G", true)
            .addField(Emojis.getString("honor") + " " + Translator.getString(data.lang, "character", "honor"), Translator.getFormater(data.lang).format(data.honor), true)
        //.addField(Emojis.getString("shield") + " " + Translator.getString(data.lang, "character", "damage_reduction"), Translator.getFormater(data.lang).format(Math.round((data.stats.armor + data.statsEquipment.armor) / ((8 * (Math.pow(data.level, 2))) / 7 + 5) * .5 * 10000) / 100) + "%", true)
        //.addField(Emojis.getString("critical") + " " + Translator.getString(data.lang, "character", "critical_chance"), Translator.getFormater(data.lang).format(criticalChance) + "%", true)
        //.addField(Emojis.getString("stun") + " " + Translator.getString(data.lang, "character", "maximum_stun_chance"), Translator.getFormater(data.lang).format(maximumStunChance) + "%", true)
        return embed;
    }

    characterStatsToBigString(stats, otherStats, lang) {
        let str = "```";
        let totalSpaces = 30;
        for (let stat in stats) {
            let beforeNumber = "";
            let statStr = "";
            let statTotalStr = "";
            let statLocaleString = Translator.getString(lang, "stats", stat);
            if (stat !== "armor") {
                statStr = stats[stat].toString() + "+" + otherStats[stat].toString();
                statTotalStr = (stats[stat] + otherStats[stat]).toString();
            } else {
                statStr = otherStats[stat].toString();
            }

            let nbrChar = statLocaleString.length + 2;
            let lessSpaces = totalSpaces - nbrChar - (2 + statStr.length);
            beforeNumber += " ".repeat(lessSpaces);
            str += "" + statLocaleString + beforeNumber + "[" + statStr + "] " + statTotalStr + "\n"/* + end*/;
        }
        str += "```"
        return str;
    }

    userStatsPanel(data, user) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";

        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);

        //calls an embed with sum = true
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar)
            .addField(statsTitle, this.statsToString(data.stats, data.statsEquipment, this.statCompareTypes.character, user, data.lang))
        return embed;
    }

    /**
     * 
     * @param {any} min
     * @param {any} max
     * @param {string} lang
     */
    formatMinMax(min, max, lang = "en") {
        return Translator.getFormater(lang).format(min) + " / " + Translator.getFormater(lang).format(max);
    }

    /**
     * 
     * @param {number} currentXp
     * @param {number} maxXp
     * @param {number} currentLevel
     * @param {number} maxLevel
     * @param {string} lang
     */
    formatLevelProgressBar(currentXp, maxXp, currentLevel, maxLevel, lang = "en") {
        let xpProgressBar = new ProgressBar(Color.Yellow);
        let xpOn, xpBar;

        if (currentLevel === maxLevel) {
            xpOn = Translator.getString(lang, "character", "maximum_level");
            xpBar = xpProgressBar.draw(1, 1);
        } else {
            xpOn = this.formatMinMax(currentXp, maxXp, lang);
            xpBar = xpProgressBar.draw(currentXp, maxXp);
        }

        return {
            title: xpOn,
            bar: xpBar
        }
    }

    /**
     * 
     * @param {number} min
     * @param {number} max
     * @param {string} lang
     * @param {number} barSize
     */
    formatHealth(min, max, lang, barSize = 8) {
        let bar = new ProgressBarHealth();
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return Emojis.general.red_heart + " " + this.formatMinMax(min, max, lang) + "\n" + bar.draw();
    }

    /**
    *
    * @param {number} min
    * @param {number} max
    * @param {string} lang
    * @param {number} barSize
    */
    formatMana(min, max, lang, barSize = 8) {
        let bar = new ProgressBar(Color.Blue);
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return Emojis.general.water_droplet + " " + this.formatMinMax(min, max, lang) + "\n" + bar.draw();
    }

    /**
    *
    * @param {number} min
    * @param {number} max
    * @param {string} lang
    * @param {number} barSize
    */
    formatEnergy(min, max, lang, barSize = 8) {
        let bar = new ProgressBar(Color.Yellow);
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return Emojis.general.high_voltage + " " + this.formatMinMax(min, max, lang) + "\n" + bar.draw();
    }
}

module.exports = new TextDrawings();

