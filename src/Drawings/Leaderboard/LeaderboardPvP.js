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

        let idMaximumLength = 0;

        for (let rank of this.rankings) {
            if (rank.idCharacter > idMaximumLength) {
                idMaximumLength = rank.idCharacter;
            }
        }

        idMaximumLength = Translator.getFormater(this.lang).format(idMaximumLength).length;

        for (let i in this.rankings) {
            let offset = this.offset + Number.parseInt(i) + 1;
            let offsetStr = offset.toString();
            offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

            let user = this.rankings[i];

            let honorString = Translator.getFormater(this.lang).format(user.Honor);
            honorString = "`" + "•".repeat(maximumHonorLength - honorString.length) + honorString + "`";


            let actualIdString = Translator.getFormater(this.lang).format(user.idCharacter);
            actualIdString = "`" + "•".repeat(idMaximumLength - actualIdString.length) + actualIdString + "`";


            rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("honor") + honorString + Emojis.getString("idFRPG") + "`" + actualIdString + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
        }
        return "**" + Translator.getString(lang, "leaderboards", "arena", [this.sumOfAll.totalHonor]) + " (" + this.maximumRank + ")" + "**\n*" + this.getYourRankString() + "*\n\n" + rankings;
    }
}

module.exports = LeaderboardPvP;