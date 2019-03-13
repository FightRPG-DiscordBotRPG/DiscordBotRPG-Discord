const Emojis = require("./Emojis");
const Discord = require("discord.js");
const Translator = require("../Translator/Translator");

class Leaderboard {

    static ldtostr(data, type = "arena") {
        let lang = data.lang;
        let offset = data.offset;
        let maxOffset = offset + data.rankings.length;
        maxOffset = maxOffset.toString();
        maxOffset = maxOffset.length;
        let rankings = "";
        let rankDisplayFunction = Leaderboard.getRankFunction(type);
        for (let i in data.rankings) {
            rankings += rankDisplayFunction(data, i);
        }
        return "**" + Translator.getString(lang, "leaderboards", type) + " (" + data.maximumRank + ")" + "**\n\n" + rankings;
    }

    static arenaLine(data, i) {

    }

    static wbLineDamage(data, i) {
        let offset = data.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        offsetStr = offsetStr.length < Leaderboard.getNumberLength(data.rankings.length + data.offset - 1) ? ("0" + offsetStr) : offsetStr;
        let maximumDamageLenght = Leaderboard.getNumberLength(data.rankings[0].damage);
        let user = data.rankings[i];

        let damageLength = Leaderboard.getNumberLength(user.damage);
        user.damage = "0".repeat(maximumDamageLenght - damageLength) + user.damage;
        return "<:win:403151177153249281> `" + (offsetStr) + ". `<:sword:403574088389361666>` " + user.damage + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
    }

    static wbLineAttacks(data, i) {
        let offset = data.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        offsetStr = offsetStr.length < Leaderboard.getNumberLength(data.rankings.length + data.offset - 1) ? ("0" + offsetStr) : offsetStr;
        let maximumAttacksLenght = Leaderboard.getNumberLength(data.rankings[0].attackCount);
        let user = data.rankings[i];

        let damageLength = Leaderboard.getNumberLength(user.attackCount);
        user.attackCount = "0".repeat(maximumAttacksLenght - damageLength) + user.attackCount;
        return "<:win:403151177153249281> `" + (offsetStr) + ". `<:sword:403574088389361666>` " + user.attackCount + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
    }



    static getRankFunction(type = "arena") {
        switch (type) {
            case "wb_attacks":
                return Leaderboard.wbLineAttacks;
            case "wb_damage":
                return Leaderboard.wbLineDamage;
        }
    }

    static getNumberLength(number) {
        let numberLength = number.toString();
        return numberLength.length;
    }
}

module.exports = Leaderboard;