const conn = require("../../conf/mysql");
const mysql = require("mysql");
const Discord = require("discord.js");

class DiscordServers {
    /**
     * 
     * @param {Discord.GuildManager} guilds
     */
    static async serversStats(guilds) {
        let guildsAddString = "";
        let i = 0;

        guilds.cache.forEach((guild, snowflake, map) => {
            i++;
            let temp = "(?, '::', ?, ?, ?)";
            temp = mysql.format(temp, [guild.id, guild.name, guild.memberCount, guild.region]);
            if (i < guilds.cache.size) {
                temp += ",";
            } else {
                temp += ";";
            }
            guildsAddString += temp;
        });

        if (guildsAddString.length === 0) {
            return;
        }


        await conn.query("INSERT IGNORE INTO serversstats (idServer, serverPrefix, serverName, memberCount, region) VALUES " + guildsAddString);

        // affectedRows => number of rows that was added

    }

    static async newGuild(guild) {
        let temp = "(?, '::', ?, ?, ?)";
        temp = mysql.format(temp, [guild.id, guild.name, guild.memberCount, guild.region]);
        await conn.query("INSERT IGNORE INTO serversstats (idServer, serverPrefix, serverName, memberCount, region) VALUES " + temp + ";");
    }

}


module.exports = DiscordServers;