const Emojis = require("../Emojis");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Leaderboard = require("./Leaderboard");


class LeaderboardWB extends Leaderboard {

    constructor(data) {
        super(data);
        this.worldBoss = data.worldBoss;
    }

    getDisplay(title, drawCallback) {
        let embed = super.getDisplay(title, drawCallback);
        if (this.worldBoss.actualHp <= 0) {
            embed = embed.addField("--------------------------------------", Emojis.general.skull_and_bones + " " + Translator.getString(this.lang, "world_bosses", "boss_already_dead"));
        }

        return embed;
    }


}

module.exports = LeaderboardWB;