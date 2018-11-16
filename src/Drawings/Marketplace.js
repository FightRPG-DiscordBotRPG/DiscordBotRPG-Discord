const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const TextDrawings = require("./TextDrawings");


class Marketplace {
    toString(data) {
        let lang = data.lang;
        let str = "```\n";
        str += Translator.getString(lang, "marketplace", "header_str") + "\n\n";
        let orders = data.orders;
        if (orders.length > 0) {
            for (let order of orders) {
                str += order.seller_name + " - " + order.idItem + " - " + order.item.name + " - " + order.item.type + " (" + order.item.subType + ")" + " - " + order.item.level + " - " + order.item.rarity + " - " + order.item.power + "%" + " - " + "x" + order.item.number + " - " + order.price + "G" + "\n";
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

module.exports = new Marketplace();