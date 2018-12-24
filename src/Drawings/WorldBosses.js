const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBar");
const Discord = require("discord.js");
const Emojis = require("./Emojis");

class WorldBosses {
    listToDiscord(data) {
        let lang = data.lang;
        let str = "";
        let pb = new ProgressBar();
        if (data.bosses.length > 0) {
            for (let info of data.bosses) {
                str += info.regionName + " - " + info.areaName + "\n";
                str += ""
                if (info.worldBoss != null) {
                    str += info.worldBoss.name + " (" + Translator.getFormater(data.lang).format(info.worldBoss.actualHP) + "/" + Translator.getFormater(data.lang).format(info.worldBoss.maxHP) + ") " + pb.draw(info.worldBoss.actualHP, info.worldBoss.maxHP);
                } else {
                    let date = new Date();
                    date.setTime(info.spawnDate);
                    str += Translator.getString(lang, "world_bosses", "spawn_date", [date.toLocaleString(lang.length > 2 ? lang : lang + "-" + lang.toUpperCase()) + " UTC"]);
                }
                str += "\n";
            }
            return str;
        } else {
            return Translator.getString(lang, "world_bosses", "no_world_boss");
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

    attackToDiscord(data_fight, data_ranks, data_boss) {
        let lang = data_fight.lang;
        return new Discord.RichEmbed()
            .setAuthor(data_ranks.worldBoss.bossName)
            .addField(Emojis.getString("sword") + Translator.getString(lang, "fight_general", "combat_log"), Translator.getString(lang, "world_bosses", "boss_fight_damage_inflicted", [data_fight.damage]))
            .addField(Emojis.getString("win") + Translator.getString(lang, "leaderboards", "wb_damage"), Translator.getString(lang, "world_bosses", "boss_fight_recap_damage_dealt", [data_ranks.worldBoss.damage, data_ranks.worldBoss.damageRank]), true)
            .addField(Emojis.getString("win") + Translator.getString(lang, "leaderboards", "wb_attacks"), Translator.getString(lang, "world_bosses", "boss_fight_recap_attack_count", [data_ranks.worldBoss.attackCount, data_ranks.worldBoss.attackCountRank]), true)
            .addField(Emojis.getString("monster") + Translator.getString(lang, "help_panel", "world_boss_title"), this.listToDiscord(data_boss));
    }
}

module.exports = new WorldBosses();