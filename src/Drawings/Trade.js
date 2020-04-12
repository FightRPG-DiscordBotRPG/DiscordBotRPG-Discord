const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const ItemShow = require("./ItemShow");


class Trade {
    toString(data) {
        let rembed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(data.lang, "trade", "title", [data.trade.playerOneName, data.trade.playerTwoName]));

        let id = 1;
        let field1 = "• " + Translator.getString(data.lang, "guild", "money", [data.trade.playerOneMoneyProposal]) + "\n";
        for (let item of data.trade.playerOneItemsProposal) {
            field1 += "• " + "[" + id + "] " + ItemShow.itemToStr(item) + "\n";
            id++;
        }

        let field2 = "• " + Translator.getString(data.lang, "guild", "money", [data.trade.playerTwoMoneyProposal]) + "\n";
        for (let item of data.trade.playerTwoItemsProposal) {
            field2 += "• " + "[" + id + "] " + ItemShow.itemToStr(item) + "\n";
            id++;
        }

        rembed.addField(Translator.getString(data.lang, "trade", "is_proposing", [data.trade.playerOneName]), "" + field1 + "");
        rembed.addField(Translator.getString(data.lang, "trade", "is_proposing", [data.trade.playerTwoName]), "" + field2 + "");

        return rembed;
    }

}

module.exports = new Trade();