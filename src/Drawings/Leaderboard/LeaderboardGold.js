const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardGold extends Leaderboard {

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

        let maximumGoldLength = Translator.getFormater(this.lang).format(this.rankings[0].money).length;

        for (let i in this.rankings) {
            let offset = this.offset + Number.parseInt(i) + 1;
            let offsetStr = offset.toString();
            offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

            let user = this.rankings[i];

            let goldString = Translator.getFormater(this.lang).format(user.money);
            let userMoneyStringBefore = "`" + "•".repeat(maximumGoldLength - goldString.length) + goldString + "`";


            rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("money_bag") + userMoneyStringBefore + Emojis.getString("idFRPG") + "`" + user.idCharacter + "` - " + user.userName + "\n";
        }
        return "**" + Translator.getString(lang, "leaderboards", "gold", [this.sumOfAll.totalGold]) + " (" + this.maximumRank + ")" + "**\n\n" + rankings;
    }
}

module.exports = LeaderboardGold;