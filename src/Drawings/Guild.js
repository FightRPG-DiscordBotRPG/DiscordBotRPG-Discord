const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");

/**
 * @typedef {import("../Users/User")} User
 **/


class Guild {
    /**
     * 
     * @param {any} data
     * @param {User} user If we need to do mobile speicific things
     */
    toString(data, user) {
        let members = data.members;
        let lang = data.lang;
        let rmStr = "`";
        let rmStr2 = "`";
        let roStr = "`";
        let rgmStr = "`";

        let membersArray = [];

        for (let i in members) {
            members[i].id = i;
            membersArray.push(members[i]);
        }

        membersArray.sort((a, b) => {
            return b.level - a.level
        });

        let lastBeforelfMember = 0;
        let lastBeforelfOfficer = 0;

        membersArray.forEach((value) => {
            let valToAdd = value.id + "-" + value.name + " (" + value.level + ")";

            switch (value.rank) {
                case 1:
                    if (lastBeforelfMember + valToAdd.length > 50) {
                        valToAdd = valToAdd + "\n";
                        lastBeforelfMember = 0;
                    } else {
                        valToAdd += " - ";
                    }
                    lastBeforelfMember += valToAdd.length;

                    if ((rmStr + valToAdd).length < 1024) {
                        rmStr += valToAdd;
                    } else {
                        rmStr2 += valToAdd;
                    }
                    break;
                case 2:
                    if (lastBeforelfOfficer + valToAdd.length > 50) {
                        valToAdd = valToAdd + "\n";
                        lastBeforelfOfficer = 0;
                    } else {
                        valToAdd += " - ";
                    }
                    lastBeforelfOfficer += valToAdd.length;
                    roStr += valToAdd;
                    break;
                case 3:
                    rgmStr += valToAdd;
                    break;
            }
        });


        rmStr = rmStr.slice(0, rmStr.length - 1) + "`\n";
        rmStr2 = rmStr2.slice(0, rmStr.length - 1) + "`\n";
        roStr = (roStr.slice(roStr.length - 3, roStr.length) == " - " ? roStr.slice(0, roStr.length - 3) : roStr) + "`\n";
        rgmStr = rgmStr + "`";

        let nextLevel;
        if (data.level < data.maxLevel) {
            nextLevel = Translator.getString(lang, "guild", "required_to_level_up", [data.nextLevelPrice]);
        } else {
            //reused max level message from character, should cause no issues
            nextLevel = Translator.getString(lang, "character", "maximum_level");
        }

        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(data.name + " (ID " + data.id + ") - " + Translator.getString(lang, "guild", "members_out_of", [membersArray.length, data.maxMembers]), data.image)
            .addField(Emojis.getString("loudspeaker") + " " + Translator.getString(lang, "guild", "guild_announcement"), (data.message !== "" ? data.message : Translator.getString(lang, "guild", "no_guild_announcement")))
            
            .addField(Emojis.getString("king") + " " + Translator.getString(lang, "guild", "guild_master"), rgmStr)
            
            .addField(Emojis.getString("man_pilot") + " " + Translator.getString(lang, "guild", "officer"), roStr, true)
            .addField(Emojis.getString("person") + " " + Translator.getString(lang, "guild", "member"), rmStr);

        if (rmStr2.length > 4) {
            embed.addField(Emojis.getString("person") + " " + Translator.getString(lang, "guild", "member"), rmStr2);
        }

        embed.addField(Emojis.getString("honor") + " " + Translator.getString(lang, "guild", "guild_territory_enroll"), (data.currentTerritoryEnroll !== null ? data.currentTerritoryEnroll : Translator.getString(lang, "general", "none")), true)
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(lang, "guild", "money_available"), Translator.getString(lang, "guild", "money", [data.money]), true)
            .addField(Emojis.getString("exp") + " " + Translator.getString(lang, "guild", "level_out_of", [data.level, data.maxLevel]), nextLevel, true)
            .addField(Emojis.general.collision + " " + Translator.getString(lang, "guild", "total_player_power").slice(0, -4), Translator.getFormater(lang).format(data.totalPower), true)
            .addField(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "guild", "total_player_level").slice(0, -4), Translator.getFormater(lang).format(data.totalLevel), true)
            ;


        return embed;
    }

    territoriesToString(data) {
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(data.lang, "guild", "guild_territories", [data.totalNumberOfTerritories]));

        for (let region in data.territories) {
            let areas = "";
            for (let area of data.territories[region]) {
                areas += " - " + area + "\n";
            }
            embed.addField(region, areas);
        }

        return embed;
    }

    appliancesToString(data) {
        let lang = data.lang;
        let idMaxLength = 10;
        let nameMaxLength = 39;
        let levelMaxLength = 11;

        let id;
        let name;
        let level;

        let str = "```";

        if (data.appliances.length > 0) {
            str += "|" + "    id    " + "|" + "                  name                  " + "|" + "   level   " + "|" + "\n";
            for (let appliance of data.appliances) {
                id = appliance.id.toString().length;
                id = (idMaxLength - id) / 2;

                name = appliance.name.length;
                name = (nameMaxLength - name) / 2;

                level = appliance.level.toString().length;
                level = (levelMaxLength - level) / 2;


                str += "|" + " ".repeat(Math.floor(id)) + appliance.id + " ".repeat(Math.ceil(id)) + "|" +
                    " ".repeat(Math.floor(name)) + appliance.name + " ".repeat(Math.ceil(name)) + "|" +
                    " ".repeat(Math.floor(level)) + appliance.level + " ".repeat(Math.ceil(level)) + "|\n"
            }
        } else {
            str += Translator.getString(lang, "guild", "nobody_ask_to_join_your_guild");
        }
        str += "\n" + Translator.getString(lang, "general", "page_out_of_x", [data.page, data.maxPage]);
        str += "```";
        return str;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    guildsToString(data, user) {
        let lang = data.lang;

        let fields = [];

        let mobileLineBreaks = "";
        let desktopTrait = "-";

        if (user.isOnMobile) {
            mobileLineBreaks = "\n";
            desktopTrait = "";
        }

        if (data.guilds.length > 0) {
            let contentString = "";
            for (let i in data.guilds) {
                let guild = data.guilds[i];

                let levelSpaces = guild.level.toString().length < 2 ? "0" : "";

                let guildStr = `${Emojis.emojisProd.idFRPG.string} ${guild.id} - ${Emojis.general.clipboard} ${guild.name} ${desktopTrait} ` +
                    `${mobileLineBreaks}${Emojis.emojisProd.levelup.string} ${Translator.getString(lang, "inventory_equipment", "level")} ${levelSpaces}${guild.level} - ${Emojis.emojisProd.user.string} ${guild.nbMembers} / ${guild.maxMembers}` +
                    `\n${Emojis.general.collision} ${Translator.getString(lang, "guild", "total_player_power", [guild.totalPower])} ${desktopTrait} ${mobileLineBreaks}${Emojis.emojisProd.levelup.string} ${Translator.getString(lang, "guild", "total_player_level", [guild.totalLevel])}`;

                let shouldCreateEmbed = i != 0;

                if (shouldCreateEmbed ) {
                    fields.push(contentString);
                    contentString = "";
                }

                contentString += guildStr;

                if (i == data.guilds.length-1) {
                    fields.push(contentString);
                    contentString = "";
                }
            }
        } else {
            fields.push(Translator.getString(lang, "guild", "nothing_to_print"));
        }



        let embed = new Discord.MessageEmbed()
            .setAuthor(Translator.getString(lang, "help_panel", "guilds_title"));

        fields.push(Translator.getString(lang, "general", "page_out_of_x", [data.page, data.maxPage]));

        for (let i in fields) {
            embed.addField("--------------------------------------", fields[i]);
        }

        return embed;
    }

    disbandConfirm(lang="en") {
        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Emojis.getString("warning") + " " + Translator.getString(lang, "guild", "head_disband") + " " + Emojis.getString("warning"))
            .addField(Translator.getString(lang, "general", "description"), Translator.getString(lang, "guild", "body_disband"), true);
    }
}

module.exports = new Guild();
