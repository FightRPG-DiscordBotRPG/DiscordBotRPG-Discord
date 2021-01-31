const Translator = require("../Translator/Translator");
const ItemShow = require("./ItemShow");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Globals = require("../Globals");
const GenericMultipleEmbedList = require("./GenericMultipleEmbedList");

class Inventory {
    /**
     * 
     * @param {any} data
     * @param {Boolean} isInventory
     */
    displayAsList(data, isInventory) {
        let lang = data.lang;

        let emptyTitle = "";
        let pageObject = null;
        let header = "";
        let titleEmbed = "";

        if (isInventory) {
            header += Translator.getString(lang, "inventory_equipment", "id") + " - ";
            pageObject = { page: data.page, maxPage: data.maxPage == 0 ? 1 : data.maxPage };
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


        let inventoryList = new GenericMultipleEmbedList();
        inventoryList.load({ collection: data.items, displayIfEmpty: emptyTitle, listType: 0, pageRelated: pageObject }, lang, (i, item) => {
            return (isInventory ? i + " - " : "") + ItemShow.itemToStr(item, lang);
        });

        let embed = new Discord.MessageEmbed()
            .setColor([128, 128, 128])
            .setAuthor(titleEmbed)
            .setDescription(header)
            ;

        return inventoryList.getEmbed(embed);
    }

    ciValueSellAllDisplay(data) {
        let lang = data.lang;

        let strFilters = [];
        if (data.isFiltered) {
            for (let key of Object.keys(data.params)) {
                if (data.params[key] >= 0 || data.params[key] !== "" && data.params[key] !== null) {
                    switch (key) {
                        case "rarity":
                            strFilters.push(Emojis.getRarityEmoji(Globals.getRarityName(data.params.rarity)) + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_rarity", [Translator.getString(lang, "rarities", Globals.getRarityName(data.params.rarity))]));
                            break;
                        case "type":
                            strFilters.push(Emojis.getItemTypeEmoji(Globals.getTypeName(data.params.type)) + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_type", [Translator.getString(lang, "item_types", Globals.getTypeName(data.params.type))]));
                            break;
                        case "subtype":
                            strFilters.push(Emojis.getItemSubTypeEmoji(Globals.getSubtypeName(data.params.subtype)) + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_subtype", [Translator.getString(lang, "item_sous_types", Globals.getSubtypeName(data.params.subtype))]));
                            break;
                        case "level_up":
                            strFilters.push(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_level_sup", [data.params.level]));
                            break;
                        case "level_down":
                            strFilters.push(Emojis.emojisProd.leveldown.string + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_level_inf", [data.params.level_down]));
                            break;
                        case "power_up":
                            strFilters.push(Emojis.general.collision + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_power_sup", [data.params.power]));
                            break;
                        case "power_down":
                            strFilters.push(Emojis.general.collision + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_power_inf", [data.params.power_down]));
                            break;
                        case "name":
                            strFilters.push(Emojis.general.clipboard + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_name", [data.params.name.replace(/%/g, "")]));
                            break;
                        case "rebirth_up":
                            strFilters.push(Emojis.emojisProd.rebirth_up.string + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_rebirth_sup", [data.params.rebirth]));
                            break;
                        case "rebirth_down":
                            strFilters.push(Emojis.emojisProd.rebirth_down.string + " " + Translator.getString(lang, "inventory_equipment", "sellall_going_to_sell_rebirth_inf", [data.params.rebirth_down]));
                            break;
                    }

                }
            }
        }

        let str = strFilters.join("\n");

        if (str.length === 0) {
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