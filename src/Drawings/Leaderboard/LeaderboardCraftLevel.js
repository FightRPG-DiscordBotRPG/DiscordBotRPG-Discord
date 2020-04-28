const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardCraftLevel extends Leaderboard {

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

        let maximumLevelLength = 0;
        let maximumExpLength = 0;
        let idMaximumLength = 0;

        //first loop maximum of each
        for (let rank of this.rankings) {
            if (rank.actualLevel > maximumLevelLength) {
                maximumLevelLength = rank.actualLevel;
            }
            if (rank.actualExp > maximumExpLength) {
                maximumExpLength = rank.actualExp;
            }
            if (rank.idCharacter > idMaximumLength) {
                idMaximumLength = rank.idCharacter;
            }
        }

        maximumLevelLength = Translator.getFormater(this.lang).format(maximumLevelLength).length;
        maximumExpLength = Translator.getFormater(this.lang).format(maximumExpLength).length;
        idMaximumLength = Translator.getFormater(this.lang).format(idMaximumLength).length;


        for (let i in this.rankings) {
            let offset = this.offset + Number.parseInt(i) + 1;
            let offsetStr = offset.toString();
            offsetStr = offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;

            let user = this.rankings[i];


            let actualLevelString = Translator.getFormater(this.lang).format(user.actualLevel);
            actualLevelString = "`" + "•".repeat(maximumLevelLength - actualLevelString.length) + actualLevelString + "`";

            let actualExpString = Translator.getFormater(this.lang).format(user.actualExp);
            actualExpString = "`" + "•".repeat(maximumExpLength - actualExpString.length) + actualExpString + "`";

            let actualIdString = Translator.getFormater(this.lang).format(user.idCharacter);
            actualIdString = "`" + "•".repeat(idMaximumLength - actualIdString.length) + actualIdString + "`";



            rankings += Emojis.getString("win") + "`" + (offsetStr) + ". `" + Emojis.getString("hammer") + actualLevelString + Emojis.getString("exp") + actualExpString + Emojis.getString("idFRPG") + "`" + actualIdString + "` - " + user.userName + "\n";
        }
        return "**" + Translator.getString(lang, "leaderboards", "craftlevel", [this.sumOfAll.totalLevels, this.sumOfAll.totalExp]) + " (" + this.maximumRank + ")" + "**\n*" + this.getYourRankString() +"*\n\n" + rankings;
    }
}

module.exports = LeaderboardCraftLevel;