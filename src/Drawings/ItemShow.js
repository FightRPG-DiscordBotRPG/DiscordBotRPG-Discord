const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const TextDrawings = require("./TextDrawings");
const Emojis = require("./Emojis");
const User = require("../Users/User");

class ItemShow {

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {any} isEquipped
     */
    showItem(data, user, isEquipped = false) {

        let item = data.item;
        let lang = data.lang;

        let numberStr = item.number > 1 ? " [x" + Translator.getFormater(lang).format(item.number) + "]" : "";
        let equippedStr = isEquipped ? " (" + Translator.getString(lang, "inventory_equipment", "currently_equipped") + ")" : "";
        let itemName = item.name + (item.isFavorite == true ? " ★" : "") + numberStr + equippedStr;



        let embed = new Discord.MessageEmbed()
            .setAuthor(itemName)
            .setColor(item.rarityColor)
            .addField(Translator.getString(lang, "inventory_equipment", "type"), Emojis.getItemTypeEmoji(item.type_shorthand) + " " + item.type, true)
            .addField(Translator.getString(lang, "inventory_equipment", "subtype"), Emojis.getItemSubTypeEmoji(item.subtype_shorthand) + " " + item.subType, true)
            .addField(Translator.getString(lang, "inventory_equipment", "rarity"), Emojis.getRarityEmoji(item.rarity_shorthand) + " " + item.rarity, true)
            .addField(Translator.getString(lang, "inventory_equipment", "level"), Emojis.getString("levelup") + " " + Translator.getFormater(lang).format(item.level), true)
            .addField(Translator.getString(lang, "inventory_equipment", "power"), Emojis.general.collision + " " + Translator.getFormater(lang).format(item.power), true);

        if (!user.isOnMobile) {
            embed.addField("\u200b", "\u200b", true);
        }
            
        return embed
            .addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.itemStatsToStrCompare(item.stats, data.equippedStats, user, lang))
            .addField(Translator.getString(lang, "general", "description"), item.desc);
    }

    itemToStr(item, lang = "en") {
        let numberStr = item.number > 1 ? " [x" + Translator.getFormater(lang).format(item.number) + "]" : "";
        return "**" + item.name + "**" + (item.isFavorite == true ? " ★" : "") + numberStr + " - " + Emojis.getItemTypeEmoji(item.type_shorthand) + " " + item.type + " (" + Emojis.getItemSubTypeEmoji(item.subtype_shorthand) + " " + item.subType + ")" + " - " + item.level + " - " + Emojis.getRarityEmoji(item.rarity_shorthand) + " " + item.rarity + " - " + item.power;
    }
}

module.exports = new ItemShow();
