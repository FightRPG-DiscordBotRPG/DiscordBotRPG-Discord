const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardWBAttacks extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        if (this.rankings.length > 0) {
            let maximumAttacksLength = Translator.getFormater(this.lang).format(this.rankings[0].attackCount).length;
            return this.getDisplay(Translator.getString(this.lang, "leaderboards", "wb_attacks"), (i, user) => {
                return this.getFullLine(user, i, Emojis.getString("sword") + this.getFieldDisplay(user.attackCount, maximumAttacksLength));
            });
        } else {
            return Translator.getString(lang, "leaderboards", "wb_have_not_participate");
        }

    }

}

module.exports = LeaderboardWBAttacks;