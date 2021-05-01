const discord = require("discord.js");
const Globals = require("./Globals");
const GenericMultipleEmbedList = require("./Drawings/GenericMultipleEmbedList");
const Emojis = require("./Drawings/Emojis");
const Translator = require("./Translator/Translator");

class Utils {
    static emptyEmbedCharacter = "\u200b";

    /**
     * 
     * @param {discord.ShardClientUtil} shard
     */
    static async getTotalNumberOfGuilds(shard) {
        try {
            let allCounts = await shard.broadcastEval("this.guilds.cache.size");
            let total = 0;
            for (let count in allCounts) {
                total += allCounts[count];
            }

            return total;
        } catch {
            return 1;
        }

    }

    /**
     * 
     * @param {discord.MessageEmbed} embed
     */
    static addEmptyFieldToEmbed(embed) {
        return embed.addField("\u200b", "\u200b", true);
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

    /**
    * 
    * @param {Array} pool
    * @param {number} k
    * @param {boolean} destructive
    * @returns {Array}
    */
    static sample(pool, k, destructive) {
        var n = pool.length;
        if (k < 0 || k > n)
            throw new RangeError("Sample larger than population or is negative");

        if (destructive || n <= (k <= 5 ? 21 : 21 + Math.pow(4, Math.ceil(Math.log(k * 3, 4))))) {

            if (!destructive)
                pool = Array.prototype.slice.call(pool);
            for (let i = 0; i < k; i++) { // invariant: non-selected at [i,n)
                var j = i + Math.random() * (n - i) | 0;
                var x = pool[i];
                pool[i] = pool[j];
                pool[j] = x;
            }
            pool.length = k; // truncate
            return pool;
        } else {
            let selected = new Set();
            let ret = [];
            while (selected.add(Math.random() * n | 0).size < k) { }
            selected.forEach((i, j) => ret.push(pool[i]));
            return ret;
        }
    }

    /**
     * 
     * @param {Array} arr
     * @param {number} n
     */
    static getRandomItemsInArray(arr, n) {
        return this.sample(arr, Utils.getProtectedNValue(arr, n), false);
    }


    /**
    *
    * @param {Array} arr
    * @param {number} n
    */
    static getProtectedNValue(arr, n) {
        if (n > arr.length) {
            return arr.length;
        } else if (n < 0) {
            return 1;
        }
        return n;
    }

    static getHelpPanel(lang="en", page=1) {
        let maxPage = 8;
        page = page && page > 0 && page <= maxPage ? page : 1;
        // Fix lang is null on some users, maybe when first loaded
        // So now if lang isn't valid or loaded, we use the default english one
        lang = Globals.helpPanel[lang] == null ? "en" : lang;
        return {
            commands: Globals.helpPanel[lang][page],
            page: page,
            maxPage: maxPage,
        };
    }

    static addToEmbedRequiredItems(embed, requiredItems, lang = "en") {
        if (requiredItems != null && requiredItems.length > 0) {
            embed = embed.addField(Emojis.general.package + " " + Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "craft", "header_required"));
            let neededItems = new GenericMultipleEmbedList();
            neededItems.load({ collection: requiredItems, displayIfEmpty: "", listType: 0 }, lang, (index, itemNeeded) => {
                let emojiMissing = itemNeeded.missing == 0 ? Emojis.general.g_vmark : (itemNeeded.missing < itemNeeded.number ? Emojis.emojisProd.tild.string : Emojis.general.g_xmark);
                return `${emojiMissing} **${itemNeeded.name}** - ${Emojis.getItemTypeEmoji(itemNeeded.type_shorthand)} ${itemNeeded.type} - ${Emojis.getResourceSubtype(itemNeeded.subType_shorthand, itemNeeded.rarity_shorthand)} ${itemNeeded.subType} - ${Emojis.getRarityEmoji(itemNeeded.rarity_shorthand)} ${itemNeeded.rarity} - x${Translator.getFormater(lang).format(itemNeeded.number)}`;
            });
            return neededItems.getEmbed(embed);
        } else {
            embed = embed.addField(Emojis.general.package + " " +Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "general", "none"));
            return embed;
        }

    }
}


module.exports = Utils