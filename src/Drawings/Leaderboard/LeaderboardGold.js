const Emojis = require("../Emojis");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardGold extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumGoldLength = Translator.getFormater(this.lang).format(this.rankings[0].money).length;
        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "gold", [this.sumOfAll.totalGold]), (i, user) => {
            return this.getFullLine(user, i, Emojis.getString("money_bag") + this.getFieldDisplay(user.money, maximumGoldLength));
        });
    }
}

module.exports = LeaderboardGold;