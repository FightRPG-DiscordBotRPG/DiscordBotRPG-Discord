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
                let compareResults;

                switch (type) {
                    case this.statCompareTypes.item:
                        compareResults = this.getDisplayItemCompare(stats[stat], compareStats[stat]);
                        diff = compareResults.diff;
                        compareEmoji = compareResults.compareEmoji;
                        break;
                    case this.statCompareTypes.character:
                    case this.statCompareTypes.only_total:
                    case this.statCompareTypes.talents:

                        if (compareStats[stat] == null) {
                            compareStats[stat] = 0;
                        }

                        if (stat !== "armor") {
                            diff = "+" + compareStats[stat].toString();
                        } else {
                            // Setting stats[armor] at total stat value 
                            stats[stat] += compareStats[stat]
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
                if (type !== this.statCompareTypes.only_total && type !== this.statCompareTypes.talents) {
                    statStr = stats[stat].toString();
                    strStatWithDiff = "[" + this.getStatValue(stat, stats[stat]) + diff + "]";
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

                    if (this.statCompareTypes.character === type || this.statCompareTypes.only_total === type || this.statCompareTypes.talents === type) {
                        totalSpaces = 30;
                    }


                    lessSpaces = totalSpaces - nbrChar - (2 + statStr.length);
                    end = "\n";
                    quote = "`";
                }
                beforeNumber += " ".repeat(lessSpaces <= 0 ? 1 : lessSpaces);



                let strToAdd = Emojis.stats[stat] + quote + statLocalized + beforeNumber + strStatWithDiff + totalStat + quote + " " + compareEmoji + end;

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

    getStatValue(statName, statValue) {
        if (statName.includes("Cost")) {
            return -statValue;
        } else {
            return statValue;
        }
    }

    getDisplayItemCompare(firstStat, secondStat) {
        let diff, compareEmoji;
        if (isNaN(secondStat)) {
            secondStat = 0;
        }

        let diffNumber = (firstStat - secondStat);
        diff = " (" + (diffNumber > 0 ? "+" : "") + diffNumber + ")";

        if (diffNumber > 0) {
            compareEmoji = Emojis.emojisProd.plussign.string;
        }
        else if (diffNumber < 0) {
            compareEmoji = Emojis.emojisProd.minussign.string;
        } else {
            compareEmoji = Emojis.emojisProd.nochange.string;
        }


        return { diff: diff, compareEmoji: compareEmoji };
    }

    /**
     * DEPRECATED
     * @param {any} stats
     * @param {any} otherStats
     * @param {any} lang
     */
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
    formatHealth(min, max, lang, barSize = 8, fullText = false, withEmoji = true) {
        let bar = new ProgressBarHealth();
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return (withEmoji ? Emojis.general.red_heart + " " : "") + (fullText ? " " + Translator.getString(lang, "character", "health_points") + " " : "") + this.formatMinMax(min, max, lang) + (barSize > 0 ? "\n" + bar.draw() : "");
    }

    /**
    *
    * @param {number} min
    * @param {number} max
    * @param {string} lang
    * @param {number} barSize
    */
    formatMana(min, max, lang, barSize = 8, fullText = false, withEmoji = true) {
        let bar = new ProgressBar(Color.Blue);
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return (withEmoji ? Emojis.general.water_droplet + " " : "") + (fullText ? Translator.getString(lang, "character", "mana_points") + " " : "") + this.formatMinMax(min, max, lang) + (barSize > 0 ? "\n" + bar.draw() : "");
    }

    /**
    *
    * @param {number} min
    * @param {number} max
    * @param {string} lang
    * @param {number} barSize
    */
    formatEnergy(min, max, lang, barSize = 8, fullText = false, withEmoji = true) {
        let bar = new ProgressBar(Color.Yellow);
        bar.min = min;
        bar.max = max;
        bar.setSize(barSize);

        return (withEmoji ? Emojis.general.high_voltage + " " : "") + (fullText ? Translator.getString(lang, "character", "energy_points") + " " : "") + this.formatMinMax(min, max, lang) + (barSize > 0 ? "\n" + bar.draw() : "");
    }
}

module.exports = new TextDrawings();

