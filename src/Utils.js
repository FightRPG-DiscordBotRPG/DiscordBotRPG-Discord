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

    static clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }

    static add(obj1, obj2) {
        let newObj = { ...obj1 };
        for (const key of Object.keys(obj2)) {
            if (key in newObj) {
                newObj[key] += obj2[key];
            }
        }

        return newObj;
    }
}


module.exports = Utils