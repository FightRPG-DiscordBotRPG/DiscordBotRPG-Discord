const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBars/ProgressBar");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Color = require("./Color");

class TextDrawings {

    itemStatsToStrCompare(stats, compareStats, lang) {
        let str = "`";
        let count = 1;
        let totalSpaces = 30;
        let noStats = true;
        compareStats = compareStats != undefined ? compareStats : {};
        for (let stat in stats) {
            if (stats[stat] > 0 || compareStats[stat]) {
                let diff = compareStats[stat] >= 0 ? " -> " + (stats[stat] - compareStats[stat]) : " -> 0";

                noStats = false;
                let end = "";
                let beforeNumber = "";
                let statStr = stats[stat].toString();
                let statLocalized = Translator.getString(lang, "stats", stat);
                let nbrChar = statLocalized.length + 2 + diff.length;
                let lessSpaces = totalSpaces - nbrChar - (2 + statStr.length);
                beforeNumber += " ".repeat(lessSpaces);
                if (count === 2) {
                    end += "\n"
                    count = 0;
                } else {

                    end += " ".repeat(1) + "|" + " ".repeat(1);
                }
                count++;
                str += "" + statLocalized + beforeNumber + "[" + stats[stat] + diff + "]" + end;
            }

        }
        if (noStats) {
            str += Translator.getString(lang, "inventory_equipment", "item_no_stats");
        }
        str += "`";
        return str;
    }

    characterStatsToString(stats, otherStats, lang) {
        let str = "```";
        let count = 1;
        let totalSpaces = 25;
        for (let stat in stats) {
            //let end = stat === "luck" ? "" : "   |   ";
            let end = "";
            let beforeNumber = "";
            let statStr = "";
            let statLocaleString = Translator.getString(lang, "stats", stat);
            if (stat !== "armor") {
                statStr = stats[stat].toString() + "+" + otherStats[stat].toString();
            } else {
                statStr = otherStats[stat].toString();
            }

            let nbrChar = statLocaleString.length + 2;
            let lessSpaces = totalSpaces - nbrChar - (2 + statStr.length);
            beforeNumber += " ".repeat(lessSpaces);
            if (count === 2) {
                end += "\n"
                count = 0;
            } else {

                end += " ".repeat(2) + "|" + " ".repeat(2);
            }
            count++;
            str += "" + statLocaleString + beforeNumber + "[" + statStr + "]" + end;
        }
        str += "```"
        return str;
    }

    userInfoPanel(data) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let xpProgressBar = new ProgressBar(Color.Yellow);
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
            .addField(statsTitle, this.characterStatsToString(data.stats, data.statsEquipment, data.lang))
            .addField(titleXPFight, xpBar, true)
            .addField(titleXPCraft, xpBarCraft, true)
            .addField(Emojis.getString("red_heart") + " " + Translator.getString(data.lang, "character", "health_points"), Translator.getFormater(data.lang).format((data.stats.constitution + data.statsEquipment.constitution + 1) * 10), true)
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
    
    userStatsPanel(data) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";

        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);
        
        //calls an embed with sum = true
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar)
            .addField(statsTitle, this.characterStatsToBigString(data.stats, data.statsEquipment, data.lang, true))
        return embed;
    }

}

module.exports = new TextDrawings();

