const Emojis = require("../Emojis");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");

class LeaderboardAchievements extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumAchievPoints = this.getNumberLength(this.rankings[0].points);
        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "power", [this.sumOfAll.totalPOints]), (i, user) => {
            return this.getFullLine(user, i, Emojis.general.trophy + this.getFieldDisplay(user.points, maximumAchievPoints));
        });
    }
}

module.exports = LeaderboardAchievements;