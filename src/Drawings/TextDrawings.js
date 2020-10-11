const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBars/ProgressBar");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Color = require("./Color");
const User = require("../Users/User");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");



class TextDrawings {

    statCompareTypes = {
        "character": 0,
        "item": 1,
        "talents": 2,
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

                if (type === this.statCompareTypes.item) {

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
                } else if (type === this.statCompareTypes.character) {
                    if (stat !== "armor") {
                        diff = "+" + compareStats[stat].toString();
                    } else {
                        // Setting stats[armor] at total stat value 
                        stats[stat] = compareStats[stat];
                        compareStats[stat] = 0;
                    }

                    totalStat = (stats[stat] + compareStats[stat]).toString();
                    totalStat = " " + " ".repeat(1 + user.isOnMobile ? (maximumStatLength - totalStat.length) : 0) + totalStat;
                }



                noStats = false;

                let beforeNumber = "";
                let statStr = stats[stat].toString();
                let statLocalized = Translator.getString(lang, "stats", stat);
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

                let strToAdd = Emojis.stats[stat] + quote + statLocalized + beforeNumber + "[" + stats[stat] + diff + "]" + totalStat + quote + " " + compareEmoji + end;

                if (type === this.statCompareTypes.talents) {
                    if (stats[stat] !== 0) {
                        str += strToAdd;
                    }
                } else {
                    str += strToAdd;
                }

            }

        }
        if (noStats) {
            str += "`" + Translator.getString(lang, "inventory_equipment", "item_no_stats") + "`";
        }


        return str;
    }

    getBiggestStatLength(stats, compareStats) {
        let length = 0;
        for (let i in stats) {
            let total = (stats[i] + (compareStats[i] != null ? compareStats[i] : 0)).toString();
            if (total.length > length) {
                length = total.length;
            }
        }

        return length;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    userInfoPanel(data, user) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let xpProgressBar = new ProgressBar(Color.Yellow);
        let healthBar = new ProgressBarHealth().draw(data.currentHp, data.maxHp);
        let xpBar = "";
        let xpOn = "";

        let xpBarCraft = "";
        let xpOnCraft = "";

        if (data.level === data.maxLevel) {
            xpOn = Translator.getString(data.lang, "character", "maximum_level");
            xpBar = xpProgressBar.draw(1, 1);
        } else {
            xpOn = Translator.getFormater(data.lang).format(data.actualXp) + " / " + Translator.getFormater(data.lang).format(data.xpNextLevel);
            xpBar = xpProgressBar.draw(data.actualXp, data.xpNextLevel);
        }

        if (data.craft.level === data.maxLevel) {
            xpOnCraft = Translator.getString(data.lang, "character", "maximum_level");
            xpBarCraft = xpProgressBar.draw(1, 1);
        } else {
            xpOnCraft = Translator.getFormater(data.lang).format(data.craft.xp) + " / " + Translator.getFormater(data.lang).format(data.craft.xpNextLevel);
            xpBarCraft = xpProgressBar.draw(data.craft.xp, data.craft.xpNextLevel);
        }


        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);
        let titleXPFight = Translator.getString(data.lang, "character", "level") + ": " + data.level + "\n" + xpOn + " ";
        let titleXPCraft = Translator.getString(data.lang, "character", "craft_level") + ": " + data.craft.level + "\n" + xpOnCraft + " ";
        let criticalChance = ((data.stats.dexterity + data.statsEquipment.dexterity) / (data.level * 8));
        criticalChance = criticalChance > 0.75 ? 0.75 : criticalChance;
        criticalChance = Math.round(criticalChance * 10000) / 100;

        let maximumStunChance = ((data.stats.charisma + data.statsEquipment.charisma) / (data.level * 8));
        maximumStunChance = maximumStunChance > 0.5 ? 0.5 : maximumStunChance;
        maximumStunChance = Math.round(maximumStunChance * 10000) / 100;


        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar)
            .addField(statsTitle, this.statsToString(data.stats, data.statsEquipment, this.statCompareTypes.character, user, data.lang))
            .addField(titleXPFight, xpBar, true)
            .addField(titleXPCraft, xpBarCraft, true)
            .addField(Emojis.getString("red_heart") + " " + Translator.getString(data.lang, "character", "health_points") + "\n" + Translator.getFormater(data.lang).format(data.currentHp) + " / " + Translator.getFormater(data.lang).format(data.maxHp), healthBar)
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(data.lang, "character", "money"), Translator.getFormater(data.lang).format(data.money) + " G", true)
            .addField(Emojis.getString("honor") + " " + Translator.getString(data.lang, "character", "honor"), Translator.getFormater(data.lang).format(data.honor), true)
            .addField(Emojis.getString("shield") + " " + Translator.getString(data.lang, "character", "damage_reduction"), Translator.getFormater(data.lang).format(Math.round((data.stats.armor + data.statsEquipment.armor) / ((8 * (Math.pow(data.level, 2))) / 7 + 5) * .5 * 10000) / 100) + "%", true)
            .addField(Emojis.getString("critical") + " " + Translator.getString(data.lang, "character", "critical_chance"), Translator.getFormater(data.lang).format(criticalChance) + "%", true)
            .addField(Emojis.getString("stun") + " " + Translator.getString(data.lang, "character", "maximum_stun_chance"), Translator.getFormater(data.lang).format(maximumStunChance) + "%", true)
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
}

module.exports = new TextDrawings();

