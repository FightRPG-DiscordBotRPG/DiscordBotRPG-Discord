const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardPvP extends Leaderboard {

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
        let maximumHonorLength = this.getNumberLength(this.rankings[0].Honor);
        for (let i in this.rankings) {
            let offset = this.offset + Number.parseInt(i) + 1;
            let offsetStr = offset.toString();
            offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

            let user = this.rankings[i];

            let honorString = Translator.getFormater(this.lang).format(user.Honor);
            honorString = "`" + "•".repeat(maximumHonorLength - honorString.length) + honorString + "`";


            rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("honor") + honorString + Emojis.getString("idFRPG") + "`" + user.idCharacter + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
        }
        return "**" + Translator.getString(lang, "leaderboards", "arena", [this.sumOfAll.totalHonor]) + " (" + Translator.getFormater(this.lang).format(this.maximumRank) + ")" + "**\n\n" + rankings;
    }
}

module.exports = LeaderboardPvP;
