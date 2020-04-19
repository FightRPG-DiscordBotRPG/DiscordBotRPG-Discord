const Discord = require("discord.js");
const Translator = require("../Translator/Translator");


class Guild {
    toString(data) {
        let members = data.members;
        let lang = data.lang;
        let rmStr = Translator.getString(lang, "guild", "member") + "\n`";
        let roStr = Translator.getString(lang, "guild", "officer") + "\n`";
        let rgmStr = Translator.getString(lang, "guild", "guild_master") + "\n`";

        let officerCount = 0;
        let membersCount = 0;
        let nbMembers = 0
        for (let i in members) {
            nbMembers++;
            switch (members[i].rank) {
                case 1:
                    rmStr += i + "-" + members[i].name + " (" + members[i].level + "),";
                    membersCount++;
                    break;
                case 2:
                    roStr += i + "-" + members[i].name + " (" + members[i].level + "),";
                    officerCount++;
                    break;
                case 3:
                    rgmStr += i + "-" + members[i].name + " (" + members[i].level + "),";
                    break;
            }
        }
        rmStr = rmStr.slice(0, rmStr.length - 1) + "`\n";
        roStr = roStr.slice(0, roStr.length - 1) + "`\n";
        rgmStr = rgmStr.slice(0, rgmStr.length - 1) + "`\n";

        let allMembersStr = rgmStr + (officerCount > 0 ? roStr : "") + (membersCount > 0 ? rmStr : "");
        if (allMembersStr.length > 1024) {
            allMembersStr = allMembersStr.substring(0, 1024);
        }

        let nextLevel;
        if (data.level < data.maxLevel) {
            nextLevel = Translator.getString(lang, "guild", "required_to_level_up", [data.nextLevelPrice]);
        } else {
            //reused max level message from character, should cause no issues
            nextLevel = Translator.getString(lang, "character", "maximum_level");
        }

        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(data.name + " (ID " + data.id + ")", data.image)
            .addField(Translator.getString(lang, "guild", "guild_announcement"), (data.message !== "" ? data.message : Translator.getString(lang, "guild", "no_guild_announcement")), true)
            .addField(Translator.getString(lang, "guild", "guild_territory_enroll"), (data.currentTerritoryEnroll !== null ? data.currentTerritoryEnroll : Translator.getString(lang, "general", "none")), true)
            .addField(Translator.getString(lang, "guild", "members_out_of", [nbMembers, data.maxMembers]), allMembersStr)
            .addField(Translator.getString(lang, "guild", "level_out_of", [data.level, data.maxLevel]), nextLevel, true)
            .addField(Translator.getString(lang, "guild", "money_available"), Translator.getString(lang, "guild", "money", [data.money]), true);

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

    guildsToString(data) {
        let str = "```";
        let idMaxLength = 10;
        let nameMaxLength = 35;
        let levelMaxLength = 11;
        let guildmembersMaxLenght = 15;

        let idLength;
        let nameLength;
        let levelLength;
        let guildmembersLength;

        let lang = data.lang;

        if (data.guilds.length > 0) {
            str += "|" + "    id    " + "|" + "                name               " + "|" + "   level   " + "|" + "    members    " + "|" + "\n";
            for (let i of data.guilds) {

                idLength = i.id.toString().length;
                idLength = (idMaxLength - idLength) / 2;

                nameLength = i.name.length;
                nameLength = (nameMaxLength - nameLength) / 2;

                levelLength = i.level.toString().length;
                levelLength = (levelMaxLength - levelLength) / 2;

                guildmembersLength = i.nbMembers.toString().length + 1 + i.maxMembers.toString().length;
                guildmembersLength = (guildmembersMaxLenght - guildmembersLength) / 2;



                str += "|" + " ".repeat(Math.floor(idLength)) + i.id + " ".repeat(Math.ceil(idLength)) + "|" +
                    " ".repeat(Math.floor(nameLength)) + i.name + " ".repeat(Math.ceil(nameLength)) + "|" +
                    " ".repeat(Math.floor(levelLength)) + i.level + " ".repeat(Math.ceil(levelLength)) + "|" +
                    " ".repeat(Math.floor(guildmembersLength)) + i.nbMembers + "/" + i.maxMembers + " ".repeat(Math.ceil(guildmembersLength)) + "|\n"
            }
        } else {
            str += Translator.getString(lang, "guild", "nothing_to_print");
        }

        str += Translator.getString(lang, "general", "page_out_of_x", [data.page, data.maxPage]);

        str += "```";
        return str;
    }
}

module.exports = new Guild();
