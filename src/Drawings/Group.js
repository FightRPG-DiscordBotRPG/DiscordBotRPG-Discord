const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const TextDrawings = require("./TextDrawings");


class Group {
    toStr(data) {
        let lang = data.lang;

        let membersList = new GenericMultipleEmbedList();
        data.members.unshift(data.leader);
        membersList.load({ collection: data.members, displayIfEmpty: "", listType: 0 }, lang, (index, member) => {
            return this.getOnePlayerDisplay(member, lang)
        });



        let invitedList = new GenericMultipleEmbedList();
        invitedList.load({ collection: data.invitedPlayers, displayIfEmpty: Translator.getString(lang, "group", "nobody_was_invited"), listType: 0 }, lang, (index, invited) => {
            return this.getOnePlayerDisplay(invited, lang)
        });


        let embed = new Discord.MessageEmbed()
            .setColor([0, 127, 255])
            .setAuthor({ name: Translator.getString(lang, "group", "group") + " | " + Translator.getString(lang, "group", "avg_level", [data.avgLevel]) + " | " + Translator.getString(lang, "group", "avg_power", [data.avgPower]), iconURL: "http://www.cdhh.fr/wp-content/uploads/2012/04/icon_groupe2.jpg" })
            .addField("--------------------------------------", Translator.getString(lang, "group", "members_of_the_group") + " (" + data.numberOfPlayers + " / 5)");

        embed = membersList.getEmbed(embed);

        embed.addField("--------------------------------------", Translator.getString(lang, "group", "invited_users") + " (" + data.numberOfInvitedPlayers + " / 5)")
        embed = invitedList.getEmbed(embed);

        //    ;

        return embed;
    }

    getOnePlayerDisplay(player, lang = "en") {
        let emojiClass = Emojis.emojisProd.user.string;//[Emojis.emojisProd.user.string, Emojis.general.mage][Math.floor(Math.random() * 2)];
        let barsText = `${TextDrawings.formatHealth(player.actualHP, player.maxHP, lang, 0)}\n` +
            `${TextDrawings.formatMana(player.actualMP, player.maxMP, lang, 0)}\n` +
            `${TextDrawings.formatEnergy(player.actualEnergy, player.maxEnergy, lang, 0)}`;

        return `${emojiClass} **${player.name}** (${player.areaName} - ${player.idArea})\n${Emojis.emojisProd.level.string} ${Translator.getString(lang, "inventory_equipment", "level")} ${Translator.getFormater(lang).format(player.level)}\n${Emojis.general.collision} ${Translator.getString(lang, "inventory_equipment", "power")} ${Translator.getFormater(lang).format(player.power)}\n${barsText}\n\n`
    }
}

module.exports = new Group();