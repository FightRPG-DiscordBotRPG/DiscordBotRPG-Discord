const Translator = require("../Translator/Translator");
const ItemShow = require("./ItemShow");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Globals = require("../Globals");

class Inventory {
    ciDisplay(data) {
        let lang = data.lang;
        let str = "```";
        //str += "|   nb   |" + "                             Nom                               |" + "         Type         |" + " Niveau |" + "    Rareté    |\n";
        str += Translator.getString(lang, "inventory_equipment", "id") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "name") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "type") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "level") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "rarity") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "power") + "\n\n";

        let empty = true;
        for (let index in data.items) {
            str += index + " - " + ItemShow.itemToStr(data.items[index], lang) + "\n";
            empty = false;
        }
        if (empty) {
            str += Translator.getString(lang, "inventory_equipment", "empty_inventory");
        }

        str += "\n\n" + Translator.getString(lang, "inventory_equipment", "page_x_out_of", [data.page, data.maxPage == 0 ? 1 : data.maxPage])
        str += "```"
        return str;
    }

    ceDisplay(data) {
        let lang = data.lang;
        let str = "```";
        str += Translator.getString(lang, "inventory_equipment", "name") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "type") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "level") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "rarity") + " - ";
        str += Translator.getString(lang, "inventory_equipment", "power") + "\n\n";
        let empty = true;

        let items = data.items;
        for (let i in items) {
            str += ItemShow.itemToStr(items[i], lang) + "\n";
            empty = false;
        }
        if (empty) {
            str += Translator.getString(lang, "inventory_equipment", "nothing_equipped");
        }

        return str + "```";
    }

    ciValueSellAllDisplay(data) {
        let lang = data.lang;
        let str = "";
        if (data.isFiltered) {
            if (data.params.rarity !== 0) {
                str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_rarity", [Translator.getString(lang, "rarities", Globals.getRarityName(data.params.rarity))]);
            } else if (data.params.type !== 0) {
                str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_type", [Translator.getString(lang, "item_types", Globals.getTypeName(data.params.type))]);
            } else if (data.params.level !== 0) {
                str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_level", [data.params.level]);
            } else if (data.params.power !== 0) {
                str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_power_inf", [data.params.power]);
            } else {
                str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_all");
            }
        } else {
            str = Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_all");
        }
        return new Discord.MessageEmbed()
            .setColor([255, 215, 0])
            .setAuthor(Translator.getString(lang, "inventory_equipment", "sellall_title"))
            .addField(Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell"), str)
            .addField(Translator.getString(lang, "inventory_equipment", "sellall_total_value"), Translator.getFormater(lang).format(data.value) + " G")
            .addField(Translator.getString(lang, "inventory_equipment", "sellall_are_you_sure"), Translator.getString(data.lang, "travel", "sure_to_travel_body", [Emojis.getString("vmark"), Emojis.getString("xmark")]));

    }
}

module.exports = new Inventory();