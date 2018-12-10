const Translator = require("../Translator/Translator");
const ItemShow = require("./ItemShow");

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
}

module.exports = new Inventory();