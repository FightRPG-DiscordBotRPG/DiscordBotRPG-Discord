const Emojis = require("./Emojis");

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
}

module.exports = Leaderboard;