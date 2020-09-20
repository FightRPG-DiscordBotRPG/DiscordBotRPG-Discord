const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const Emojis = require("./Emojis");

class Craft {
    craftToEmbed(data) {
        let craft = data.craft;
        let lang = data.lang;

        let embed = this.getSharedEmbed(craft, lang)
            .addField(Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "craft", "header_required"));


        let neededItems = new GenericMultipleEmbedList();
        neededItems.load({ collection: craft.requiredItems, displayIfEmpty: "", listType: 0 }, lang, (index, itemNeeded) => {
            let emojiMissing = itemNeeded.missing == 0 ? Emojis.general.g_vmark : (itemNeeded.missing < itemNeeded.number ? Emojis.emojisProd.tild.string : Emojis.general.g_xmark);
            return `${emojiMissing} **${itemNeeded.name}** - ${Emojis.getItemTypeEmoji(itemNeeded.type_shorthand)} ${itemNeeded.type} - ${Emojis.getResourceSubtype(itemNeeded.subType_shorthand, itemNeeded.rarity_shorthand)} ${itemNeeded.subType} - ${Emojis.getRarityEmoji(itemNeeded.rarity_shorthand)} ${itemNeeded.rarity} - x${Translator.getFormater(lang).format(itemNeeded.number)}`;
        });


        return neededItems.getEmbed(embed);
    }

    craftToMissing(data) {
        let craft = data.craft;
        let lang = data.lang;


        let neededItems = new GenericMultipleEmbedList();
        let missing = false;

        neededItems.load({ collection: craft.requiredItems, listType: 0 }, lang, (index, itemNeeded) => {
            let missingNumber = itemNeeded.missing;
            
            if (missingNumber > 0) {
                missing = true;
                let emojiMissing = missingNumber == itemNeeded.number ? Emojis.general.g_xmark : Emojis.emojisProd.tild.string ;
                return `${emojiMissing} **${itemNeeded.name}** - x${Translator.getFormater(lang).format(missingNumber)}`;
            }
            return null;
        });

        if (missing) {
            let embed = this.getSharedEmbed(craft, lang)
                .addField(Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "errors", "craft_dont_have_required_items"));
            return neededItems.getEmbed(embed);
        } else {
            return null;
        }

    }

    getSharedEmbed(craft, lang) {
        return new Discord.MessageEmbed()
            .setAuthor(craft.name)
            .setColor(craft.rarityColor)
            .addField(this.getCraftTitleString(craft, lang), craft.desc);
    }

    getCraftTitleString(craft, lang) {
        return Emojis.getItemTypeEmoji(craft.type_shorthand) + " " + craft.type + " (" + Emojis.getItemSubTypeEmoji(craft.subType_shorthand) + " " + craft.subType + ")" + " | " + Emojis.getRarityEmoji(craft.rarity_shorthand) + " " + craft.rarity + " | " + Translator.getString(lang, "general", "lvl") + " " + Emojis.emojisProd.leveldown.string + " " + craft.minLevel + " - " + Emojis.emojisProd.levelup.string + " " + craft.maxLevel;
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
