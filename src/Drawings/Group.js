const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");

class Group {
    toStr(data) {
        let lang = data.lang;
        let membersOfGroup = "";
        membersOfGroup += this.getOnePlayerDisplay(data.leader, lang);
        for (let member of data.members) {
            membersOfGroup += this.getOnePlayerDisplay(member, lang);
        }

        let invitedPlayers = "";
        if (data.numberOfInvitedPlayers > 0) {
            for (let invited of data.invitedPlayers) {
                invitedPlayers += this.getOnePlayerDisplay(invited, lang);
            }
        } else {
            invitedPlayers += Translator.getString(lang, "group", "nobody_was_invited");
        }


        let embed = new Discord.MessageEmbed()
            .setColor([0, 127, 255])
            .setAuthor(Translator.getString(lang, "group", "group") + " | " + Translator.getString(lang, "group", "avg_level", [data.avgLevel]) + " | " + Translator.getString(lang, "group", "avg_power", [data.avgPower]), "http://www.cdhh.fr/wp-content/uploads/2012/04/icon_groupe2.jpg")
            .addField(Translator.getString(lang, "group", "members_of_the_group") + " (" + data.numberOfPlayers + " / 5)", membersOfGroup)
            .addField(Translator.getString(lang, "group", "invited_users") + " (" + data.numberOfInvitedPlayers + " / 5)", invitedPlayers);

        return embed;
    }

    getOnePlayerDisplay(player, lang = "en") {
        let emojiClass = Emojis.emojisProd.user.string;//[Emojis.emojisProd.user.string, Emojis.general.mage][Math.floor(Math.random() * 2)];
        let healthText = "\n" + Emojis.getString("red_heart") + " " + Translator.getString(lang, "character", "health_points") + " " + Translator.getFormater(lang).format(player.currentHp) + " / " + Translator.getFormater(lang).format(player.maxHp) + "\n" + new ProgressBarHealth().draw(player.currentHp, player.maxHp);

        return `${emojiClass} **${player.name}**\n${Emojis.getString("levelup")} ${Translator.getString(lang, "inventory_equipment", "level")} ${Translator.getFormater(lang).format(player.level)}\n${Emojis.general.collision} ${Translator.getString(lang, "inventory_equipment", "power")} ${Translator.getFormater(lang).format(player.power)}${healthText}\n\n`
    }
}

module.exports = new Group();