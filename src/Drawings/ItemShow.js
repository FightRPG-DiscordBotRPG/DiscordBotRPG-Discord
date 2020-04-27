const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const TextDrawings = require("./TextDrawings");

class ItemShow {

    showItem(data, isEquipped=false) {
        let item = data.item;
        let lang = data.lang;
        console.log(item);
        let numberStr = item.number > 1 ? " [x" + Translator.getFormater(lang).format(item.number) + "]" : "";
        let equippedStr = isEquipped ? " (" + Translator.getString(lang, "inventory_equipment", "currently_equipped") + ")" : "";
        return new Discord.MessageEmbed()
            .setAuthor(item.name + (item.isFavorite == true ? " ★" : "") + numberStr)
            .setColor(item.rarityColor)
            .addField(item.type + " (" + item.subType + ")" + " | " + item.rarity + " | " + Translator.getString(lang, "general", "lvl") + ": " + item.level + " | " + Translator.getString(lang, "inventory_equipment", "power") + ": " + item.power + equippedStr, item.desc)
            .addField(Translator.getString(lang, "inventory_equipment", "attributes") + ": ", TextDrawings.itemStatsToStrCompare(item.stats, data.equippedStats, lang));
    }

    itemToStr(item, lang = "en") {
        let numberStr = item.number > 1 ? " [x" + Translator.getFormater(lang).format(item.number) + "]" : "";
        return item.name + (item.isFavorite == true ? " ★" : "") + numberStr + " - " + item.type + " (" + item.subType + ")" + " - " + item.level + " - " + item.rarity + " - " + item.power;
    }
}

module.exports = new ItemShow();
