const Translator = require("../Translator/Translator");
const Discord = require("discord.js");

class Shop {
    displayItems(data) {
        let lang = data.lang;
        let str = "```" + Translator.getString(lang, "shop", "header") + "\n\n";
        let it = 1;

        if (data.items.length > 0) {
            for (let item of data.items) {
                let id = it + (data.perPage * (data.page - 1));
                str += id + " - " + item.name + " [x" + item.number + "]" + " - " + item.subType + " - " + item.level + " - " + item.rarity + " - " + (data.tax == true ? item.priceWithTax : item.price) + "G\n";
                it++;
            }
            str += "\n";
        } else {
            str += Translator.getString(lang, "general", "nothing_at_this_page") + "\n\n";
        }

        str += Translator.getString(lang, "general", "page_out_of_x", [data.page, data.maxPage])
        str += "```";
        return str;
    }
}

module.exports = new Shop();