const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");
const ItemShow = require("./ItemShow");
const Emojis = require("./Emojis");

class Shop {
    displayItems(data) {
        let lang = data.lang;

        let listOfShopItems = new GenericMultipleEmbedList();

        listOfShopItems.load({ collection: data.items, displayIfEmpty: Translator.getString(data.lang, "general", "nothing_at_this_page"), listType: 0, pageRelated: { page: data.page, maxPage: data.maxPage } }, data.lang, (index, item) => {
            return (Number.parseInt(index) + 1) + " - " + ItemShow.itemToStr(item, lang) + " - " + Emojis.general.money_bag + " " + Translator.getFormater(lang).format(item.priceWithTax) + "G";
        });

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: Translator.getString(lang, "shop", "header") });

        return listOfShopItems.getEmbed(embed);
    }
}

module.exports = new Shop();
