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

    tryParseRarity (rarity) {
        switch (rarity) {
            case "common":
                rarity = 1;
                break;
            case "rare":
                rarity = 2;
                break;
            case "superior":
                rarity = 3;
                break;
            case "epic":
                rarity = 4;
                break;
            case "legendary":
                rarity = 5;
                break;
            case "mythic":
                rarity = 6;
                break;
        }
        return rarity;
    }
    
    tryParseType (type) {
        switch (type) {
            case "weapon":
                type = 1;
                break;
            case "chest":
                type = 2;
                break;
            case "legs":
                type = 3;
                break;
            case "head":
                type = 4;
                break;
            case "resource":
                type = 5;
                break;
            case "lootbox":
                type = 6;
                break;
            case "potion":
                type = 7;
                break;
            case "mount":
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
