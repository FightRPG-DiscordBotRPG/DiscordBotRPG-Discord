const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardWBDamage extends Leaderboard {

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
            let maximumDamageLenght = Translator.getFormater(this.lang).format(this.rankings[0].damage).length;

            for (let i in this.rankings) {
                let offset = this.offset + Number.parseInt(i) + 1;
                let offsetStr = offset.toString();
                offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

                let user = this.rankings[i];

                let damageString = Translator.getFormater(this.lang).format(user.damage);
                let userDamageString = "`" + "•".repeat(maximumDamageLenght - damageString.length) + Translator.getFormater(this.lang).format(user.damage) + "`";

                rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("sword") + userDamageString + " - " + user.userName + "(" + user.actualLevel + ")" + "\n";
            }
            return "**" + Translator.getString(lang, "leaderboards", "wb_damage") + " (" + this.maximumRank + ")" + "**\n\n" + rankings;
        }
        else {
            return Translator.getString(lang, "leaderboards", "wb_have_not_participate");
        }
    }

}

module.exports = LeaderboardWBDamage;