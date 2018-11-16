const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBar");
const Discord = require("discord.js");

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

                end += " ".repeat(3) + "|" + " ".repeat(3);
            }
            count++;
            str += "" + statLocaleString + beforeNumber + "[" + statStr + "]" + end;
        }
        str += "```"
        return str;
    }

    userInfoPanel(data) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let xpProgressBar = new ProgressBar();
        let xpBar = "";
        let xpOn = "";

        let xpBarCraft = "";
        let xpOnCraft = "";

        if (data.level === data.maxLevel) {
            xpOn = Translator.getString(data.lang, "character", "maximum_level");
            xpBar = xpProgressBar.draw(1, 1);
        } else {
            xpOn = data.actualXp + " / " + data.xpNextLevel;
            xpBar = xpProgressBar.draw(data.actualXp, data.xpNextLevel);
        }

        if (data.craft.level === data.maxLevel) {
            xpOnCraft = Translator.getString(data.lang, "character", "maximum_level");
            xpBarCraft = xpProgressBar.draw(1, 1);
        } else {
            xpOnCraft = data.craft.xp + " / " + data.craft.xpNextLevel;
            xpBarCraft = xpProgressBar.draw(data.craft.xp, data.craft.xpNextLevel);
        }


        let authorTitle = data.username + " | " + Translator.getString(data.lang, "inventory_equipment", "power") + " : " + data.power + "%";
        let statsTitle = Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);
        let titleXPFight = Translator.getString(data.lang, "character", "level") + " : " + data.level + " | " + xpOn + " ";
        let titleXPCraft = Translator.getString(data.lang, "character", "craft_level") + " : " + data.craft.level + " | " + xpOnCraft + " ";


        let embed = new Discord.RichEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, data.avatar)
            .addField(statsTitle, this.characterStatsToString(data.stats, data.statsEquipment, data.lang))
            .addField(titleXPFight, xpBar, true)
            .addField(titleXPCraft, xpBarCraft, true)
            .addBlankField(true)
            .addField(Translator.getString(data.lang, "character", "money"), data.money + " G", true)
            .addField(Translator.getString(data.lang, "character", "honor"), data.honor, true)
            .addBlankField(true);
        return embed;
    }

}

module.exports = new TextDrawings();