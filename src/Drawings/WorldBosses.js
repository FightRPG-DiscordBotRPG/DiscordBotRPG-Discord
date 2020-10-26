const Translator = require("../Translator/Translator");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");

/**
 * @typedef {import("../Users/User")} User
 **/

class WorldBosses {
    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    listToDiscord(data, user, asEmbed = false) {
        let lang = data.lang;
        let pb = new ProgressBarHealth();

        if (!user.isOnMobile) {
            pb.setSize(20);
        }

        if (asEmbed) {

            let ListOfWorldBosses = new GenericMultipleEmbedList();
            ListOfWorldBosses.load({ collection: data.bosses, displayIfEmpty: Translator.getString(lang, "world_bosses", "no_world_boss"), listType: 0 }, lang, (index, info) => {
                let nextWorkBossInfo = Emojis.general.national_park + " " + info.regionName + " - " + info.areaName + "\n\n";
                if (info.worldBoss != null) {
                    let str = nextWorkBossInfo
                    return str + Emojis.emojisProd.boss.string + " " + info.worldBoss.name + " (" + Translator.getFormater(data.lang).format(info.worldBoss.actualHP) + "/" + Translator.getFormater(data.lang).format(info.worldBoss.maxHP) + ")\n" + pb.draw(info.worldBoss.actualHP, info.worldBoss.maxHP);
                } else {
                    let date = new Date();
                    date.setTime(info.spawnDate);
                    return nextWorkBossInfo + Emojis.emojisProd.boss.string + " " + Translator.getString(lang, "world_bosses", "spawn_date", [date.toLocaleString(lang.length > 2 ? lang : lang + "-" + lang.toUpperCase()) + " UTC"]);
                }
            });

            return ListOfWorldBosses.getEmbed(new Discord.MessageEmbed().setAuthor(Translator.getString(lang, "help_panel", "world_boss_title")));
        } else {
            if (data.bosses.length > 0) {
                let str = "";
                for (let info of data.bosses) {
                    str += Emojis.general.national_park + " " + info.regionName + " - " + info.areaName + "\n";
                    if (info.worldBoss != null) {
                        str += Emojis.emojisProd.boss.string + " " + info.worldBoss.name + " (" + Translator.getFormater(data.lang).format(info.worldBoss.actualHP) + "/" + Translator.getFormater(data.lang).format(info.worldBoss.maxHP) + ")\n" + pb.draw(info.worldBoss.actualHP, info.worldBoss.maxHP);
                    } else {
                        let date = new Date();
                        date.setTime(info.spawnDate);
                        str += Emojis.emojisProd.boss.string + " " + Translator.getString(lang, "world_bosses", "spawn_date", [date.toLocaleString(lang.length > 2 ? lang : lang + "-" + lang.toUpperCase()) + " UTC"]);
                    }
                    str += "\n\n";
                }
                return str;
            } else {
                return Translator.getString(lang, "world_bosses", "no_world_boss");
            }
        }


    }

    lastBossStats(data) {
        let lang = data.lang;
        if (data.worldBoss != null) {
            return "```** " + data.worldBoss.bossName + " **" +
                "\n" + Translator.getString(lang, "world_bosses", "boss_fight_recap_damage_dealt", [data.worldBoss.damage, data.worldBoss.damageRank]) +
                "\n" + Translator.getString(lang, "world_bosses", "boss_fight_recap_attack_count", [data.worldBoss.attackCount, data.worldBoss.attackCountRank]) + "```";
        } else {
            return Translator.getString(lang, "world_bosses", "last_boss_never_fight");
        }
    }

    attackToDiscord(data_fight, data_ranks, data_boss, user) {
        let lang = data_fight.lang;
        let damageString = data_fight.isCriticalHit ? Translator.getString(lang, "world_bosses", "boss_fight_damage_inflicted_critical", [data_fight.damage]) : Translator.getString(lang, "world_bosses", "boss_fight_damage_inflicted", [data_fight.damage]);
        return new Discord.MessageEmbed()
            .setAuthor(data_ranks.worldBoss.bossName)
            .addField(Emojis.getString("sword") + Translator.getString(lang, "fight_general", "combat_log"), damageString)
            .addField(Emojis.getString("win") + Translator.getString(lang, "leaderboards", "wb_damage"), Translator.getString(lang, "world_bosses", "boss_fight_recap_damage_dealt", [data_ranks.worldBoss.damage, data_ranks.worldBoss.damageRank]), true)
            .addField(Emojis.getString("win") + Translator.getString(lang, "leaderboards", "wb_attacks"), Translator.getString(lang, "world_bosses", "boss_fight_recap_attack_count", [data_ranks.worldBoss.attackCount, data_ranks.worldBoss.attackCountRank]), true)
            .addField(Emojis.getString("monster") + Translator.getString(lang, "help_panel", "world_boss_title"), this.listToDiscord(data_boss, user, false));
    }
}

module.exports = new WorldBosses();