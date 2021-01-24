const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");

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
            let valToAdd = value.id + "-" + value.name + " (" + value.level + " - " + value.rebirthLevel + ")";

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

            .addField(Emojis.getString("king") + " " + Translator.getString(lang, "guild", "guild_master"), rgmStr);

        if (roStr.length > 4) {
            embed.addField(Emojis.getString("man_pilot") + " " + Translator.getString(lang, "guild", "officer"), roStr, true)
        }

        if (rmStr.length > 4) {
            embed.addField(Emojis.getString("person") + " " + Translator.getString(lang, "guild", "member"), rmStr);
        }

        if (rmStr2.length > 4) {
            embed.addField(Emojis.getString("person") + " " + Translator.getString(lang, "guild", "member"), rmStr2);
        }

        embed.addField(Emojis.getString("honor") + " " + Translator.getString(lang, "guild", "guild_territory_enroll"), (data.currentTerritoryEnroll !== null ? data.currentTerritoryEnroll : Translator.getString(lang, "general", "none")), true)
            .addField(Emojis.getString("money_bag") + " " + Translator.getString(lang, "guild", "money_available"), Translator.getString(lang, "guild", "money", [data.money]), true)
            .addField(Emojis.getString("exp") + " " + Translator.getString(lang, "guild", "level_out_of", [data.level, data.maxLevel]), nextLevel, true)
            .addField(Emojis.general.collision + " " + Translator.getString(lang, "guild", "total_player_power").slice(0, -4), Translator.getFormater(lang).format(data.totalPower), true)
            .addField(Emojis.emojisProd.level.string + " " + Translator.getString(lang, "guild", "total_player_level").slice(0, -4), Translator.getFormater(lang).format(data.totalLevel), true)
            .addField(Emojis.emojisProd.rebirth.string + " " + Translator.getString(lang, "guild", "total_player_rebirth_level").slice(0, -4), Translator.getFormater(lang).format(data.totalRebirthLevel), true)
            ;

        return embed;
    }

    territoriesToString(data) {
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(data.lang, "guild", "guild_territories", [data.totalNumberOfTerritories]));
        for (let region in data.territories) {
            let areas = "--------------------\n";
            for (let area of data.territories[region]) {
                areas += Emojis.getAreaTypeEmoji(area.type_shorthand) + " - " + area.name + (area.statPoints > 0 ? " (" + Emojis.emojisProd.level.string + " " + Translator.getString(data.lang, "area", "conquest_points_to_distribute", [area.statPoints]) + ")" : "") + "\n";
            }
            embed.addField(region, areas + "--------------------");
        }

        return embed;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    appliancesToString(data, user) {
        let lang = data.lang;

        let mobileLineBreaks = "";
        let desktopTrait = "-";

        if (user.isOnMobile) {
            mobileLineBreaks = "\n";
            desktopTrait = "";
        }

        let ListedAppliances = new GenericMultipleEmbedList();
        ListedAppliances.load({ collection: data.appliances, displayIfEmpty: Translator.getString(lang, "general", "none"), listType: 0, pageRelated: { page: data.page, maxPage: data.maxPage } }, lang, (index, userOrGuild) => {
            let powerStr = "";
            let rebirthLevelStr = "";
            if (userOrGuild.power != null) {
                powerStr = ` - ${Emojis.general.collision} ${Translator.getString(lang, "inventory_equipment", "power")} ${Translator.getFormater(lang).format(userOrGuild.power)}`;
            }
            if (userOrGuild.rebirthLevel != null) {
                rebirthLevelStr = ` - ${Emojis.emojisProd.rebirth.string} ${Translator.getString(lang, "inventory_equipment", "rebirth_level")} ${Translator.getFormater(lang).format(userOrGuild.rebirthLevel)}`
            }
            console.log(userOrGuild);
            return `${Emojis.emojisProd.idFRPG.string} ${userOrGuild.id} - ${Emojis.general.clipboard} ${userOrGuild.name} ${mobileLineBreaks}${desktopTrait} ${Emojis.emojisProd.level.string} ${Translator.getString(lang, "inventory_equipment", "level")} ${userOrGuild.level}${rebirthLevelStr}${powerStr}`
        });


        let embed = new Discord.MessageEmbed()
            .setAuthor(Translator.getString(lang, "guild", "current_applications"));


        return ListedAppliances.getEmbed(embed);
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    guildsToString(data, user) {
        let lang = data.lang;

        let mobileLineBreaks = "";
        let desktopTrait = "-";

        if (user.isOnMobile) {
            mobileLineBreaks = "\n";
            desktopTrait = "";
        }

        let ListedGuilds = new GenericMultipleEmbedList();
        ListedGuilds.load({ collection: data.guilds, displayIfEmpty: Translator.getString(lang, "guild", "nothing_to_print"), listType: 0, pageRelated: { page: data.page, maxPage: data.maxPage } }, lang, (index, guild) => {
            let levelSpaces = guild.level.toString().length < 2 ? "0" : "";
            return `${Emojis.emojisProd.idFRPG.string} ${guild.id} - ${Emojis.general.clipboard} ${guild.name} ${desktopTrait} ` +
                `${mobileLineBreaks}${Emojis.emojisProd.level.string} ${Translator.getString(lang, "inventory_equipment", "level")} ${levelSpaces}${guild.level} - ${Emojis.emojisProd.user.string} ${guild.nbMembers} / ${guild.maxMembers}` +
                `\n${Emojis.general.collision} ${Translator.getString(lang, "guild", "total_player_power", [guild.totalPower])} ${desktopTrait} ${mobileLineBreaks}${Emojis.emojisProd.level.string} ${Translator.getString(lang, "guild", "total_player_level", [guild.totalLevel])}`;
        });


        let embed = new Discord.MessageEmbed()
            .setAuthor(Translator.getString(lang, "help_panel", "guilds_title"));




        return ListedGuilds.getEmbed(embed);
    }

    disbandConfirm(lang = "en") {
        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Emojis.getString("warning") + " " + Translator.getString(lang, "guild", "head_disband") + " " + Emojis.getString("warning"))
            .addField(Translator.getString(lang, "general", "description"), Translator.getString(lang, "guild", "body_disband"), true);
    }
}

module.exports = new Guild();
