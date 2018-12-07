const Translator = require("../Translator/Translator");
const ProgressBar = require("./ProgressBar");

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
                    str += info.worldBoss.name + " (" + info.worldBoss.actualHP + "/" + info.worldBoss.maxHP + ") " + pb.draw(info.worldBoss.actualHP, info.worldBoss.maxHP);
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
}

module.exports = new WorldBosses();