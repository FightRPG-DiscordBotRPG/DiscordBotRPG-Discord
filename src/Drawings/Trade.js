const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const ItemShow = require("./ItemShow");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");


/**
 * @typedef {import("../Users/User")} User
 **/

class Trade {
    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let rembed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(data.lang, "trade", "title", [data.trade.playerOneName, data.trade.playerTwoName]));

        let id = 0;

        let breakLines = user.isOnMobile ? "\n\n" : "\n";

        let userOneFields = new GenericMultipleEmbedList();
        userOneFields.load({ collection: data.trade.playerOneItemsProposal, displayIfEmpty: Translator.getString(data.lang, "general", "none"), listType: 1 }, data.lang, (index, item) => {
            id++;
            return "• " + "[" + id + "] " + ItemShow.itemToStr(item) + breakLines;
        });

        let userTwoFields = new GenericMultipleEmbedList();
        userTwoFields.load({ collection: data.trade.playerTwoItemsProposal, displayIfEmpty: Translator.getString(data.lang, "general", "none"), listType: 1 }, data.lang, (index, item) => {
            id++;
            return "• " + "[" + id + "] " + ItemShow.itemToStr(item) + breakLines;
        });

        rembed.addField(Translator.getString(data.lang, "trade", "is_proposing", [data.trade.playerOneName]), "• " + Translator.getString(data.lang, "guild", "money", [data.trade.playerOneMoneyProposal]));

        rembed = userOneFields.getEmbed(rembed);

        rembed.addField(Translator.getString(data.lang, "trade", "is_proposing", [data.trade.playerTwoName]), "• " + Translator.getString(data.lang, "guild", "money", [data.trade.playerTwoMoneyProposal]));

        rembed = userTwoFields.getEmbed(rembed);

        return rembed;
    }

}

module.exports = new Trade();