const Emojis = require("../Emojis");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");

class LeaderboardPower extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumPowerLength = this.getNumberLength(this.rankings[0].power);
        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "power", [this.sumOfAll.totalPower]), (i, user) => {
            return this.getFullLine(user, i, Emojis.general.collision + this.getFieldDisplay(user.power, maximumPowerLength));
        });
    }
}

module.exports = LeaderboardPower;