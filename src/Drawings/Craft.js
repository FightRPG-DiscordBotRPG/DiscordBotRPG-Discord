const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const Emojis = require("./Emojis");

class Craft {
    craftToEmbed(data) {
        let craft = data.craft;
        let lang = data.lang;

        let embed = new Discord.MessageEmbed()
            .setAuthor(craft.name)
            .setColor(craft.rarityColor)
            .addField(Emojis.getItemTypeEmoji(craft.type_shorthand) + " " + craft.type + " (" + Emojis.getItemSubTypeEmoji(craft.subType_shorthand) + " " + craft.subType + ")" + " | " + Emojis.getRarityEmoji(craft.rarity_shorthand) + " " + craft.rarity + " | " + Translator.getString(lang, "general", "lvl") + " " + Emojis.emojisProd.leveldown.string + " " + craft.minLevel + " - " + Emojis.emojisProd.levelup.string + " " + craft.maxLevel, craft.desc)
            .addField(Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "craft", "header_required"));


        let neededItems = new GenericMultipleEmbedList();
        neededItems.load({ collection: craft.requiredItems, displayIfEmpty: "", listType: 0 }, lang, (index, itemNeeded) => {
            return `**${itemNeeded.name}** - ${Emojis.getItemTypeEmoji(itemNeeded.type_shorthand)} ${itemNeeded.type} - ${Emojis.getResourceSubtype(itemNeeded.subType_shorthand, itemNeeded.rarity_shorthand)} ${itemNeeded.subType} - ${Emojis.getRarityEmoji(itemNeeded.rarity_shorthand)} ${itemNeeded.rarity} - x${Translator.getFormater(lang).format(itemNeeded.number)}`
        });


        return neededItems.getEmbed(embed);
    }

    getCraftList(data) {

        let listOfCrafts = new GenericMultipleEmbedList();

        listOfCrafts.load({ collection: data.crafts, displayIfEmpty: Translator.getString(data.lang, "general", "nothing_at_this_page"), listType: 0, pageRelated: { page: data.page, maxPage: data.maxPage } }, data.lang, (index, craft) => {
            return index + " - **" + craft.name + "** - " + Emojis.getItemTypeEmoji(craft.type_shorthand) + " " + craft.type + " - " + Emojis.emojisProd.leveldown.string + " " + craft.minLevel + " - " + Emojis.emojisProd.levelup.string + " " + craft.maxLevel + " - " + Emojis.getRarityEmoji(craft.rarity_shorthand) + " " + craft.rarity
        });

        let embed = new Discord.MessageEmbed()
            .setAuthor(Translator.getString(data.lang, "craft", "header_craft_list"));

        return listOfCrafts.getEmbed(embed);
    }
}

module.exports = new Craft();
