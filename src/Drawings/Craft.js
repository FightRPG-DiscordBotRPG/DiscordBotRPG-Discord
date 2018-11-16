const Translator = require("../Translator/Translator");
const Discord = require("discord.js");

class Craft {
    craftToEmbed(data) {
        let craft = data.craft;
        let lang = data.lang;
        let embed = new Discord.RichEmbed()
            .setAuthor(craft.name)
            .setColor(craft.rarityColor)
            .addField(craft.type + " (" + craft.subType + ")" + " | " + craft.rarity + " | " + Translator.getString(lang, "general", "lvl") + " : " + craft.minLevel + "-" + craft.maxLevel + " | ", craft.desc)
            .addField(Translator.getString(lang, "craft", "needed_items"), this.craftRequiredItemsToStr(craft.requiredItems, lang));
        return embed;
    }

    craftRequiredItemsToStr(requiredItems, lang) {
        let str = "```\n" + Translator.getString(lang, "craft", "header_required") + "\n";

        for (let item of requiredItems) {;
            str += "\n";
            str += item.name + " - " + item.type + " - " + item.subType + " - " + item.rarity + " - x" + item.number;
        }

        str += "```";
        return str;
    }

    getCraftList(data) {
        let str = "```\n";
        str += Translator.getString(data.lang, "craft", "header_craft_list") + "\n\n";
        if (Object.keys(data.crafts).length > 0) {
            for (let i in data.crafts) {
                str += i + " - " + data.crafts[i].name + " - " + data.crafts[i].type + " - " + data.crafts[i].minLevel + " - " + data.crafts[i].maxLevel + " - " + data.crafts[i].rarity + "\n";
            }
        } else {
            str += Translator.getString(data.lang, "general", "nothing_at_this_page") + "\n\n"
        }
        str += "\n" + Translator.getString(data.lang, "general", "page_out_of_x", [data.page, data.maxPage])
        str += "```";
        return str;
    }
}

module.exports = new Craft();