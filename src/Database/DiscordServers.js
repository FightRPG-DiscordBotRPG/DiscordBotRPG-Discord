const conn = require("../../conf/mysql");
const mysql = require("mysql");

class DiscordServers {
    static async serversStats(guilds) {
        let guildsAddString = "";
        let i = 0;

        guilds.forEach((guild, snowflake, map) => {
            i++;
            let temp = "(?, '::', ?, ?, ?)";
            temp = mysql.format(temp, [guild.id, guild.name, guild.memberCount, guild.region]);
            if (i < guilds.size) {
                temp += ",";
            } else {
                temp += ";";
            }
            guildsAddString += temp;
        });

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