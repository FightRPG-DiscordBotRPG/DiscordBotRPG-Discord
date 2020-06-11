const discord = require("discord.js");

class Utils {
    /**
     * 
     * @param {discord.ShardClientUtil} shard
     */
    static async getTotalNumberOfGuilds(shard) {
        
        let allCounts = await shard.broadcastEval("this.guilds.cache.size");
        let total = 0;
        for (let count in allCounts) {
            total += allCounts[count];
        }

        return total;
    }

    static clean (text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
}


module.exports = Utils