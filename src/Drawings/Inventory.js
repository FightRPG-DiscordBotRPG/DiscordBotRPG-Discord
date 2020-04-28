const Translator = require("../Translator/Translator");
const ItemShow = require("./ItemShow");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Globals = require("../Globals");

class Inventory {
    /**
     * 
     * @param {any} data
     * @param {Boolean} isInventory
     */
    displayAsList(data, isInventory) {
        let lang = data.lang;

        let emptyTitle = "";
        let pageNumberBody = "";
        let header = "";
        let titleEmbed = "";

        if (isInventory) {
            header += Translator.getString(lang, "inventory_equipment", "id") + " - ";
            pageNumberBody = Translator.getString(lang, "inventory_equipment", "page_x_out_of", [data.page, data.maxPage == 0 ? 1 : data.maxPage]);
            emptyTitle = Translator.getString(lang, "inventory_equipment", "empty_inventory");
            titleEmbed = Translator.getString(lang, "help_panel", "inventory_title");
        } else {
            emptyTitle = Translator.getString(lang, "inventory_equipment", isInventory ? "empty_inventory" : "nothing_equipped");
            titleEmbed = Translator.getString(lang, "help_panel", "equipment_title");
        }

        header += Translator.getString(lang, "inventory_equipment", "name") + " - ";
        header += Translator.getString(lang, "inventory_equipment", "type") + " - ";
        header += Translator.getString(lang, "inventory_equipment", "level") + " - ";
        header += Translator.getString(lang, "inventory_equipment", "rarity") + " - ";
        header += Translator.getString(lang, "inventory_equipment", "power") + "\n\n";
        let empty = true;

        let items = data.items;
        let str = "";
        let fields = [];
        let itemsKeys = Object.keys(items);
        let lastIndex = itemsKeys[itemsKeys.length - 1];
        let index = 0;

        for (let i in items) {
            let itemStr = (isInventory ? i + " - " : "") + ItemShow.itemToStr(items[i], lang);
            let shouldCreateEmbed = (str + itemStr).length > 1024 | index != 0;
            if (shouldCreateEmbed) {
                fields.push(str);
                str = "";
            }
            str += itemStr;
            empty = false;

            if (i == lastIndex) {
                fields.push(str);
                str = "";
            }

            index++;
        }

        if (empty) {
            fields.push(emptyTitle);
        }

        //str += pageNumberBody;

        let embed = new Discord.MessageEmbed()
            .setColor([128, 128, 128])
            .setAuthor(titleEmbed)
            .setDescription(header)
            ;

        fields.push(pageNumberBody);

        for (let i in fields) {
            embed.addField("--------------------------------------", fields[i]);
        }

        return embed;
    }

    ciValueSellAllDisplay(data) {
        let lang = data.lang;
        let str = "";

        if (data.isFiltered) {
            for (let key of Object.keys(data.params)) {
                if (data.params[key] !== 0 && data.params[key] != "" && data.params[key] != null) {
                    switch (key) {
                        case "rarity":
                            str += Emojis.getRarityEmoji(Globals.getRarityName(data.params.rarity)) + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_rarity", [Translator.getString(lang, "rarities", Globals.getRarityName(data.params.rarity))]);
                            break;
                        case "type":
                            str += Emojis.getItemTypeEmoji(Globals.getTypeName(data.params.type)) + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_type", [Translator.getString(lang, "item_types", Globals.getTypeName(data.params.type))]);
                            break;
                        case "level":
                            str += Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_level", [data.params.level]);
                            break;
                        case "power":
                            str += Emojis.general.collision + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_power_sup", [data.params.power]);
                            break;
                        case "name":
                            str += Emojis.general.clipboard + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_name", [data.params.name.replace(/%/g, "")]);
                            break;
                    }
                    str += "\n";
                }
            }

            //str = str.length > 3 ? str.substring(0, str.length - 3) : str;
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