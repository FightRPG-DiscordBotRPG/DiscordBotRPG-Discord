const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const ItemShow = require("./ItemShow");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const Emojis = require("./Emojis");


class Marketplace {
    toString(data) {
        let lang = data.lang;

        let OrdersList = new GenericMultipleEmbedList();
        OrdersList.load({ collection: data.orders, displayIfEmpty: Translator.getString(lang, "general", "nothing_at_this_page"), listType: 0, pageRelated: { page: data.page, maxPage: data.maxPage } }, lang, (index, order) => {
            return  Emojis.emojisProd.user.string + " " +order.seller_name + " - " + Emojis.emojisProd.idFRPG.string + " " + order.idItem + " - " + ItemShow.itemToStr(order.item, lang) + " - " + Emojis.general.money_bag + " " + Translator.getFormater(lang).format(order.price) + "G";
        });

        let embed = new Discord.MessageEmbed()
            .setAuthor(Translator.getString(lang, "help_panel", "market_title"));

        return OrdersList.getEmbed(embed);
    }
}

module.exports = new Marketplace();
