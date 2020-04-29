const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardPvP extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let maximumHonorLength = this.getNumberLength(this.rankings[0].Honor);
        return this.getDisplay(Translator.getString(this.lang, "leaderboards", "arena", [this.sumOfAll.totalHonor]), (i, user) => {
            return this.getFullLine(user, i, Emojis.getString("honor") + this.getFieldDisplay(user.Honor, maximumHonorLength), false);
        });
    }
}

module.exports = LeaderboardPvP;