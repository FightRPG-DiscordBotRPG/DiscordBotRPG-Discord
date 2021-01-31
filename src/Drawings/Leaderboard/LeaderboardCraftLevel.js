const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardCraftLevel extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumLevelLength = 0;
        let maximumExpLength = 0;

        //first loop maximum of each
        for (let rank of this.rankings) {
            if (rank.actualCraftLevel > maximumLevelLength) {
                maximumLevelLength = rank.actualCraftLevel;
            }
            if (rank.actualCraftExp > maximumExpLength) {
                maximumExpLength = rank.actualCraftExp;
            }
        }

        maximumLevelLength = Translator.getFormater(this.lang).format(maximumLevelLength).length;
        maximumExpLength = Translator.getFormater(this.lang).format(maximumExpLength).length;
        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "level", [this.sumOfAll.totalLevels, this.sumOfAll.totalExp]), (i, user) => {
            return this.getFullLine(user, i, Emojis.getString("hammer") + this.getFieldDisplay(user.actualCraftLevel, maximumLevelLength) + Emojis.getString("exp") + this.getFieldDisplay(user.actualCraftExp, maximumExpLength));
        });
    }
}

module.exports = LeaderboardCraftLevel;