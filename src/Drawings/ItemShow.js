const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const TextDrawings = require("./TextDrawings");

class ItemShow {

    showInInventoryItem(data) {
        let item = data.item;
        let lang = data.lang;
        return new Discord.RichEmbed()
            .setAuthor(item.name + (item.isFavorite == true ? " ★" : ""))
            .setColor(item.rarityColor)
            .addField(item.type + " (" + item.subType + ")" + " | " + item.rarity + " | " + Translator.getString(lang, "general", "lvl") + " : " + item.level + " | " + Translator.getString(lang, "inventory_equipment", "power") + " : " + item.power, item.desc)
            .addField(Translator.getString(lang, "inventory_equipment", "attributes") + " : ", TextDrawings.itemStatsToStrCompare(item.stats, data.equippedStats, lang));
    }

    showEquippedItem(data) {
        let item = data.item;
        let lang = data.lang;
        return new Discord.RichEmbed()
            .setAuthor(item.name + (item.isFavorite == true ? " ★" : ""))
            .setColor(item.rarityColor)
            .addField(item.type + " (" + item.subType + ")" + " | " + item.rarity + " | " + Translator.getString(lang, "general", "lvl") + " : " + item.level + " | " + Translator.getString(lang, "inventory_equipment", "power") + " : " + item.power + " (" + Translator.getString(lang, "inventory_equipment", "currently_equipped") + ")", item.desc)
            .addField(Translator.getString(lang, "inventory_equipment", "attributes") + " : ", TextDrawings.itemStatsToStrCompare(item.stats, {}, lang));
    }

    showMarketplaceItem(data) {
        let item = data.item;
        let lang = data.lang;
        return new Discord.RichEmbed()
            .setAuthor(item.name)
            .setColor(item.rarityColor)
            .addField(item.type + " (" + item.subType + ")" + " | " + item.rarity + " | " + Translator.getString(lang, "general", "lvl") + " : " + item.level + " | " + Translator.getString(lang, "inventory_equipment", "power") + " : " + item.power, item.desc)
            .addField(Translator.getString(lang, "inventory_equipment", "attributes") + " : ", TextDrawings.itemStatsToStrCompare(item.stats, data.equippedStats, lang));
    }

    itemToStr(item, lang) {
        let numberStr = item.number > 1 ? " [x" + item.number + "]" : "";
        return item.name + (item.isFavorite == true ? " ★" : "") + numberStr + " - " + item.type + " (" + item.subType + ")" + " - " + item.level + " - " + item.rarity + " - " + item.power;
    }
}

module.exports = new ItemShow();