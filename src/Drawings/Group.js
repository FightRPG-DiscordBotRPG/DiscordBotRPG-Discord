const Discord = require("discord.js");
const Translator = require("../Translator/Translator")

class Group {
    toStr(data) {
        let lang = data.lang;
        let membersOfGroup = "```diff\n";
        membersOfGroup += "+ " + data.leader.name + " | " + data.leader.level + " | " + data.leader.power + "\n";
        for (let member of data.members) {
            membersOfGroup += "+ " + member.name + " | " + member.level + " | " + member.power + "\n";
        }
        membersOfGroup += "```";

        let invitedPlayers = "```diff\n";
        if (data.numberOfInvitedPlayers > 0) {
            for (let invited of data.invitedPlayers) {
                invitedPlayers += "+ " + invited.name + " | " + invited.level + " | " + invited.power + "\n";
            }
        } else {
            invitedPlayers += "- " + Translator.getString(lang, "group", "nobody_was_invited");
        }

        invitedPlayers += "```";


        let embed = new Discord.RichEmbed()
            .setColor([0, 127, 255])
            .setAuthor(Translator.getString(lang, "group", "group") + " | " + Translator.getString(lang, "group", "avg_level", [data.avgLevel]) + " | " + Translator.getString(lang, "group", "avg_power", [data.avgPower]), "http://www.cdhh.fr/wp-content/uploads/2012/04/icon_groupe2.jpg")
            .addField(Translator.getString(lang, "group", "members_of_the_group") + " (" + data.numberOfPlayers + " / 5)", membersOfGroup)
            .addField(Translator.getString(lang, "group", "invited_users") + " (" + data.numberOfInvitedPlayers + " / 5)", invitedPlayers);

        return embed;
    }
}

module.exports = new Group();