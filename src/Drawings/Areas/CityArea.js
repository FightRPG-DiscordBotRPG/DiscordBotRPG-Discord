const Area = require("./Area");
const Emojis = require("../Emojis");
const Translator = require("../../Translator/Translator");

class CityArea extends Area {
    constructor() {
        super();
        this.type = "CityArea";
    }

    /**
     *
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let embed = super.toString(data, user);
        let forge, shop, marketplace;
        let area = data.area;
        let lang = data.lang;

        if (!area.haveOwner) {
            area.marketplace.tax = 0;
            area.shop.tax = 0;
        }
        
        if (area.craft.isActive == true) {
            forge = "\n" + Emojis.general.hammer + " " + Translator.getString(lang, "area", "service_forge", [area.craft.minLevel, area.craft.maxLevel]);
        }
        if (area.shop.isActive == true) {
            shop = "\n" + Emojis.emojisProd.gold_coins.string + " " + Translator.getString(lang, "area", "service_shop", [area.shop.tax]);
        }
        if (area.marketplace.isActive == true) {
            marketplace = Emojis.general.balance_scale + " " + Translator.getString(lang, "area", "service_marketplace", [area.marketplace.tax]);
        }


        return embed
            .addField(Translator.getString(lang, "area", "services"), marketplace + forge + shop);

    }
}

module.exports = CityArea;