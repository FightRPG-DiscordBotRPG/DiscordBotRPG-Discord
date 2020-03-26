const Globals = require("../Globals");
const Translator = require("../Translator/Translator");

class GModule {
    constructor() {
        this.isReloadable = true;
        this.loadingTime = 0;
        this.isModule = true;
        this.isLoaded = false;
        this.isActive = true;
        this.commands = [];
        this.allModulesReference = {};
    }

    async run() { }

    init() {

    }

    startLoading(name = "Generic Module") {
        this.loadingTime = Date.now();
        //console.log("Loading module : " + name);
    }

    endLoading(name = "Generic Module") {
        //console.log("Module : " + name + " loaded. Took : " + ((Date.now() - this.loadingTime) / 1000) + " seconds.");
        this.isLoaded = true;
    }

    sendMessage(message, msg) {
        msg != null && msg != "" ? message.channel.send(msg).catch((error) => {
            message.author.send(error.message).catch((e) => {
                console.log(e)
            });
        }) : null;
    }

    getToStrShort(stat, lang) {
        switch (stat) {
            // Principaux
            case "str":
                stat = "strength";
                break;
            case "int":
                stat = "intellect";
                break;
            case "con":
                stat = "constitution";
                break;
            case "dex":
                stat = "dexterity";
                break;

            // Secondaires

            case "cha":
                stat = "charisma";
                break;
            case "wis":
                stat = "wisdom";
                break;
            case "will":
                stat = "will";
                break;
            case "per":
                stat = "perception";
                break;
            case "luck":
                stat = "luck";
                break;
        }
        return stat;
    }
    
    tryParseRarity (rarity, lang) {
        switch (rarity) {
            case "common":
            case Translator.getString(data.lang, "rarities", "common"):
                rarity = 1;
                break;
            case "rare":
            case Translator.getString(data.lang, "rarities", "rare"):
                rarity = 2;
                break;
            case "superior":
            case Translator.getString(data.lang, "rarities", "superior"):
                rarity = 3;
                break;
            case "epic":
            case Translator.getString(data.lang, "rarities", "epic"):
                rarity = 4;
                break;
            case "legendary":
            case Translator.getString(data.lang, "rarities", "legendary"):
                rarity = 5;
                break;
            case "mythic":
            case Translator.getString(data.lang, "rarities", "mythic"):
                rarity = 6;
                break;
        }
        return rarity;
    }
    
    tryParseType (type, lang) {
        switch (type) {
            case "weapon":
            case Translator.getString(data.lang, "item_types", "weapon"):
                type = 1;
                break;
            case "chest":
            case Translator.getString(data.lang, "item_types", "chest"):
                type = 2;
                break;
            case "legs":
            case Translator.getString(data.lang, "item_types", "legs"):
                type = 3;
                break;
            case "head":
            case Translator.getString(data.lang, "item_types", "head"):
                type = 4;
                break;
            case "resource":
            case Translator.getString(data.lang, "item_types", "resource"):
                type = 5;
                break;
            case "lootbox":
            case Translator.getString(data.lang, "item_types", "lootbox"):
                type = 6;
                break;
            case "potion":
            case Translator.getString(data.lang, "item_types", "potion"):
                type = 7;
                break;
            case "mount":
            case Translator.getString(data.lang, "item_types", "mount"):
                type = 8;
                break;
        }
        return type;
    }

    cmdToString(data, prefix = "::") {
        let str = "```apache\n" + "::" + Translator.getString(data.lang, "help_panel", "help") + "::\n";
        for (let category in data.commands) {
            str += "[" + category + "]\n";
            for (let command in data.commands[category]) {
                str += prefix + command + " : " + data.commands[category][command] + "\n";
            }
        }
        str += "\n" + Translator.getString(data.lang, "general", "page_out_of_x", [data.page, data.maxPage]) + "```"
        return str;
    }

    getEquipableIDType(string) {
        return Globals.equipableCorresponds[string] != null ? Globals.equipableCorresponds[string] : -1;
    }

}



module.exports = GModule;
