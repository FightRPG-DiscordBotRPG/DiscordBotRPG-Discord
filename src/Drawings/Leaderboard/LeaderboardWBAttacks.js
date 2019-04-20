const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardWBAttacks extends Leaderboard {

    constructor(data) {
        super(data);
    }

    draw() {
        let lang = this.lang;
        let offset = this.offset;
        let maxOffset = offset + this.rankings.length;
        maxOffset = maxOffset.toString();
        maxOffset = maxOffset.length;
        let rankings = "";



        if (this.rankings.length > 0) {
            let maximumAttacksLength = Translator.getFormater(this.lang).format(this.rankings[0].attackCount).length;
            for (let i in this.rankings) {
                let offset = this.offset + Number.parseInt(i) + 1;
                let offsetStr = offset.toString();
                offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

                let user = this.rankings[i];

                let attackString = Translator.getFormater(this.lang).format(user.attackCount);
                let userAttackString = "`" + "•".repeat(maximumAttacksLength - attackString.length) + attackString + "`";

                rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("sword") + userAttackString + " - " + user.userName + "(" + user.actualLevel + ")" + "\n";
            }


            return "**" + Translator.getString(lang, "leaderboards", "wb_attacks") + " (" + this.maximumRank + ")" + "**\n\n" + rankings;
        } else {
            return Translator.getString(lang, "leaderboards", "wb_have_not_participate");
        }


    }

}

module.exports = LeaderboardWBAttacks;