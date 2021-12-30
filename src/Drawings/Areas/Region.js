const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");

class Region {

    static toString(data) {
        let lang = data.lang;
        let region = data.region;
        let strAreas = "";
        for (let area of region.areas) {
            strAreas += Emojis.getAreaTypeEmoji(area.type) + "`" + Region.areaToString(area) + "`\n";
        }

        let strConnectedAreas = "";
        for (let area of region.connectedAreas) {
            strConnectedAreas += Emojis.getAreaTypeEmoji(area.type) + "`" + Region.areaToString(area) + " | " + Translator.getString(lang, "area", "region", [area.region_name]) + "`\n"
        }
        if (strConnectedAreas == "") {
            strConnectedAreas = "`" + Translator.getString(lang, "area", "no_connected_regions") + "`";
        }

        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor({ name: region.name })
            .addField(Translator.getString(lang, "area", "list"), strAreas)
            .addField(Translator.getString(lang, "area", "list_regions_connected"), strConnectedAreas)
            .setImage(region.image);

    }

    static areaToString(area, lang = "en") {
        let values = [area.id, area.name, area.levels];
        let strThisArea = "";
        switch (area.type) {
            case "wild":
                strThisArea = Translator.getString(lang, "area", "wild_area", values);
                break;
            case "city":
                strThisArea = Translator.getString(lang, "area", "city_area", values);
                break;
            case "dungeon":
                strThisArea = Translator.getString(lang, "area", "dungeon_area", values);
                break;
        }

        return strThisArea;
    }
}

module.exports = Region;