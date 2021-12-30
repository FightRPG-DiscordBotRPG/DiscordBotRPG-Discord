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
            .setAuthor({ name: itemName })
            .setColor(item.rarityColor)
            .addField(Translator.getString(lang, "inventory_equipment", "type"), Emojis.getItemTypeEmoji(item.type_shorthand) + " " + item.type, true)
            .addField(Translator.getString(lang, "inventory_equipment", "subtype"), Emojis.getItemSubTypeEmoji(item.subtype_shorthand) + " " + item.subType, true)
            .addField(Translator.getString(lang, "inventory_equipment", "rarity"), Emojis.getRarityEmoji(item.rarity_shorthand) + " " + item.rarity, true)
            .addField(Translator.getString(lang, "inventory_equipment", "level"), Emojis.emojisProd.level.string + " " + Translator.getFormater(lang).format(item.level), true)
            .addField(Translator.getString(lang, "inventory_equipment", "rebirth_level"), Emojis.emojisProd.rebirth.string + " " + Translator.getFormater(lang).format(item.rebirthLevel), true)
            .addField(Translator.getString(lang, "inventory_equipment", "power"), Emojis.general.collision + " " + Translator.getFormater(lang).format(item.power), true);

        return embed
            .addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(item.stats, data.equippedStats, TextDrawings.statCompareTypes.item, user, lang))
            .addField(Translator.getString(lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(item.secondaryStats, data.equippedSecondaryStats, TextDrawings.statCompareTypes.item, user, lang))
            .addField(Translator.getString(lang, "general", "description"), item.desc);
    }

    itemToStr(item, lang = "en") {

        let numberStr = item.number > 1 ? " [x" + Translator.getFormater(lang).format(item.number) + "]" : "";
        let fields = [
            "**" + item.name + "**" + (item.isFavorite == true ? " ★" : "") + numberStr,
            Emojis.getItemTypeEmoji(item.type_shorthand) + " " + item.type + " (" + Emojis.getItemSubTypeEmoji(item.subtype_shorthand != null ? item.subtype_shorthand : item.subType_shorthand) + " " + item.subType + ")",
            Emojis.emojisProd.level.string + " " + item.level + " " + Emojis.emojisProd.rebirth.string + " " + item.rebirthLevel,
            Emojis.getRarityEmoji(item.rarity_shorthand) + " " + item.rarity,
        ];

        if (item.power) {
            fields.push(Emojis.general.collision + " " + item.power);
        }


        //return fields.join(" ");
        return fields.join(" - ");
    }
}

module.exports = new ItemShow();
