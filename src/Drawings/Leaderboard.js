const Emojis = require("./Emojis");
const Discord = require("discord.js");
const Translator = require("../Translator/Translator");

class Leaderboard {
    static leaderboardToString(data) {
        let str = "`";
        let usernameMaxLength = 34;
        let honorMaxLength = 13;
        let idMaxLength = 8;
        let levelMaxLength = 13;
        let rankMaxLength = 8;
        let statusMaxLength = 13;

        let idLength;
        let usernameLength;
        let honorLength;
        let levelLength;
        let rankLength;
        let statusLength;

        str += "|  rank  |   id   |             username             |    honor    |    level    |  connected  |\n" +
            "|________|________|__________________________________|_____________|_____________|_____________|\n";


        let offset = data.offset;
        offset++;

        for (let i of data.rankings) {
            rankLength = offset.toString().length;
            rankLength = (rankMaxLength - rankLength) / 2;

            idLength = i.idCharacter.toString().length;
            idLength = (idMaxLength - idLength) / 2;

            if (i.userName.length >= usernameMaxLength) {
                i.userName = i.userName.substring(0, usernameMaxLength - 5) + "...";
            }
            usernameLength = i.userName.length;
            usernameLength = (usernameMaxLength - usernameLength) / 2;

            honorLength = i.Honor.toString().length;
            honorLength = (honorMaxLength - honorLength) / 2;

            levelLength = i.actualLevel.toString().length;
            levelLength = (levelMaxLength - levelLength) / 2;

            let connected = i.isConnected == true ? Emojis.getString("blue_circle") : Emojis.getString("red_circle");

            statusLength = connected.length;
            statusLength = (statusMaxLength - statusLength) / 2;


            str += "|" + " ".repeat(Math.floor(rankLength)) + offset + " ".repeat(Math.ceil(rankLength)) + "|" +
                " ".repeat(Math.floor(idLength)) + i.idCharacter + " ".repeat(Math.ceil(idLength)) + "|" +
                " ".repeat(Math.floor(usernameLength)) + i.userName + " ".repeat(Math.ceil(usernameLength)) + "|" +
                " ".repeat(Math.floor(honorLength)) + i.Honor + " ".repeat(Math.ceil(honorLength)) + "|" +
                " ".repeat(Math.floor(levelLength)) + i.actualLevel + " ".repeat(Math.ceil(levelLength)) + "|" +
                " ".repeat(Math.floor(statusLength)) + connected + " ".repeat(Math.floor(statusLength)) + "|\n";

            offset++;
        }
        str += "`";
        return str;
    }

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
        let offset = data.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        offsetStr = offsetStr.length < Leaderboard.getNumberLength(data.rankings.length + offset - 1) ? ("0" + offsetStr) : offsetStr;
        let maximumHonorLength = Leaderboard.getNumberLength(data.rankings[0].Honor);
        let user = data.rankings[i];

        let honorLength = Leaderboard.getNumberLength(user.Honor);
        user.Honor = "0".repeat(maximumHonorLength - honorLength) + user.Honor;
        return "<:win:403151177153249281>`" + (offsetStr) + ". `<:honor:403824433837637632>` " + user.Honor + "`" + "<:idFRPG:523462148412932105>" + "`" + user.idCharacter + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
    }

    static wbLineDamage(data, i) {
        let offset = data.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        console.log(offsetStr.length + " vs " + Leaderboard.getNumberLength(data.rankings.length + offset - 1));
        offsetStr = offsetStr.length < Leaderboard.getNumberLength(data.rankings.length + offset - 1) ? ("0" + offsetStr) : offsetStr;
        let maximumDamageLenght = Leaderboard.getNumberLength(data.rankings[0].damage);
        let user = data.rankings[i];

        let damageLength = Leaderboard.getNumberLength(user.damage);
        user.damage = "0".repeat(maximumDamageLenght - damageLength) + user.damage;
        return "<:win:403151177153249281> `" + (offsetStr) + ". `<:sword:403574088389361666>` " + user.damage + "` - " + user.userName + " (" + user.actualLevel + ")" + "\n";
    }

    static wbLineAttacks(data, i) {
        let offset = data.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        offsetStr = offsetStr.length < Leaderboard.getNumberLength(data.rankings.length + offset - 1) ? ("0" + offsetStr) : offsetStr;
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
            case "arena":
            default:
                return Leaderboard.arenaLine;
        }
    }

    static getNumberLength(number) {
        let numberLength = number.toString();
        return numberLength.length;
    }
}

module.exports = Leaderboard;