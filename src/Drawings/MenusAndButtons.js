const Discord = require("discord.js");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");

class MenusAndButtons {
    static getConfirmButton(lang="en") {
        return new Discord.MessageButton()
            .setCustomId("confirm")
            .setLabel(Translator.getString(lang, "general", "yes"))
            .setStyle("SUCCESS")
            .setEmoji(Emojis.general.vmark);
    }

    static getValidateButton(lang = "en") {
        return new Discord.MessageButton()
            .setCustomId("confirm")
            .setLabel(Translator.getString(lang, "general", "validate"))
            .setStyle("SUCCESS")
            .setEmoji(Emojis.general.vmark);
    }

    static getCancelButton(lang="en") {
       return new Discord.MessageButton()
            .setCustomId("cancel")
            .setLabel(Translator.getString(lang, "general", "no"))
            .setStyle("DANGER")
            .setEmoji(Emojis.general.xmark)
    }
}


module.exports = MenusAndButtons;