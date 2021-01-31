const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardLevel extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumLevelLength = 0;
        let maximumExpLength = 0;
        let maximumRebirthLevelLength = 0;

        //first loop maximum of each
        for (let rank of this.rankings) {
            if (rank.actualLevel > maximumLevelLength) {
                maximumLevelLength = rank.actualLevel;
            }
            if (rank.actualExp > maximumExpLength) {
                maximumExpLength = rank.actualExp;
            }
            if (rank.rebirthLevel > maximumRebirthLevelLength) {
                maximumRebirthLevelLength = rank.rebirthLevel;
            }
        }

        maximumLevelLength = Translator.getFormater(this.lang).format(maximumLevelLength).length;
        maximumRebirthLevelLength = Translator.getFormater(this.lang).format(maximumRebirthLevelLength).length;
        maximumExpLength = Translator.getFormater(this.lang).format(maximumExpLength).length;

        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "level", [this.sumOfAll.totalLevels, this.sumOfAll.totalExp]), (i, user) => {
            return this.getFullLine(user, i, Emojis.emojisProd.rebirth.string + this.getFieldDisplay(user.rebirthLevel, maximumRebirthLevelLength) + Emojis.emojisProd.level.string + this.getFieldDisplay(user.actualLevel, maximumLevelLength) + Emojis.getString("exp") + this.getFieldDisplay(user.actualExp, maximumExpLength), false);
        });
    }
}

module.exports = LeaderboardLevel;