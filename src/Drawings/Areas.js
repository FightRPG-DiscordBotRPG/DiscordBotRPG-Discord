const Translator = require("../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("./Emojis");
const Moment = require("moment");

class Areas {
    toString(data) {
        switch (data.area.type) {
            case "city":
                return this.cityStr(data);
            default:
                return this.wildStr(data);
        }
    }

    cityStr(data) {
        let forge, shop, marketplace;
        let area = data.area;
        let lang = data.lang;

        if (!area.haveOwner) {
            area.marketplace.tax = 0;
            area.shop.tax = 0;
        }

        if (area.craft.isActive == true) {
            forge = "\n- " + Translator.getString(lang, "area", "service_forge", [area.craft.minLevel, area.craft.maxLevel]);
        }
        if (area.shop.isActive == true) {
            shop = "\n- " + Translator.getString(lang, "area", "service_shop", [area.shop.tax]);
        }
        if (area.marketplace.isActive == true) {
            marketplace = "- " + Translator.getString(lang, "area", "service_marketplace", [area.marketplace.tax]);
        }


        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(area.name + " | " + area.levels + " | " + Translator.getString(lang, "area", "owned_by", [area.owner]), area.image)
            .addField(Translator.getString(lang, "climates", "climate"), Translator.getString(lang, "climates", area.climate.climate.shorthand), true)
            .addField(Translator.getString(lang, "weather", "weather"), Translator.getString(lang, "weather", area.climate.currentWeather.shorthand) + " " + Emojis.getWeatherEmoji(area.climate.currentWeather.shorthand), true)
            .addField(Translator.getString(lang, "weather", "impact"), this.getWeatherBonusesPenalties(area.climate.currentWeather, lang))
            .addField(Translator.getString(lang, "weather", "time_before_ends"), this.getWeatherTimeLeft(area.climate.dateNextWeatherChange), true)
            .addField(Translator.getString(lang, "general", "description"), area.desc)
            .addField("Services", "```" + marketplace + forge + shop + "```")
            .setImage(area.image);

    }

    wildStr(data) {
        let area = data.area;
        let lang = data.lang;

        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(area.name + " | " + area.levels + " | " + Translator.getString(lang, "area", "owned_by", [area.owner]), area.image)
            .addField(Translator.getString(lang, "climates", "climate"), Translator.getString(lang, "climates", area.climate.climate.shorthand), true)
            .addField(Translator.getString(lang, "weather", "weather"), Translator.getString(lang, "weather", area.climate.currentWeather.shorthand) + " " + Emojis.getWeatherEmoji(area.climate.currentWeather.shorthand), true)
            .addField(Translator.getString(lang, "weather", "impact"), this.getWeatherBonusesPenalties(area.climate.currentWeather, lang))
            .addField(Translator.getString(lang, "weather", "time_before_ends"), this.getWeatherTimeLeft(area.climate.dateNextWeatherChange), true)
            .addField(Translator.getString(lang, "general", "description"), area.desc)
            .addField(Translator.getString(lang, "area", "minimum_quality"), Emojis.getRarityEmoji(area.minimum_quality_shorthand) + " **" + area.minimum_quality + "** ", true)
            .addField(Translator.getString(lang, "area", "maximum_quality"), Emojis.getRarityEmoji(area.maximum_quality_shorthand) + " **" + area.maximum_quality + "** ", true)
            .addField(Translator.getString(lang, "general", "monsters"), this.monstersToString(area.monsters, lang))
            .addField(Translator.getString(lang, "general", "resources"), this.resourcesToString(area.resources, lang))
            .setImage(area.image);
    }

    dungeonStr(data) {
        this.wildStr(data);
    }

    getWeatherTimeLeft(date) {
        return (Moment(date).diff(Moment(Date.now()), "hours") % 24).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (Moment(date).diff(Moment(Date.now()), "minutes") % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (Moment(date).diff(Moment(Date.now()), "seconds") % 60).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    }

    getWeatherBonusesPenalties(weather, lang = "en") {
        let str = "";
        let travelFatigue = 1 / weather.travelSpeed;
        let collectFatigue = 1 / weather.collectSpeed;
        let collectChances = weather.collectChances / 1;
        str += Translator.getString(lang, "bonuses", "travel_tiredness") + ` -> ${Translator.getFormater(lang).format(Math.round(travelFatigue * 100))}% (x${Translator.getFormater(lang).format(travelFatigue)})\n`;
        str += Translator.getString(lang, "bonuses", "harvest_tiredness") + ` -> ${Translator.getFormater(lang).format(Math.round(collectFatigue * 100))}% (x${Translator.getFormater(lang).format(collectFatigue)})\n`;
        str += Translator.getString(lang, "bonuses", "collect_drop") + ` -> ${Translator.getFormater(lang).format(Math.round(collectChances * 100))}% (x${Translator.getFormater(lang).format(collectChances)})`;
        return str;
    }

    monstersToString(monsters, lang = "en") {
        let str = "";
        for (let i in monsters) {
            let id = parseInt(i) + 1;
            str += Emojis.getString(monsters[i].type_shorthand);
            if (monsters[i].number > 1) {
                str += "`" + Translator.getString(lang, "area", "monster_group", [id, monsters[i].name, monsters[i].number - 1, monsters[i].level, monsters[i].type]) + "`\n";
            } else {
                str += "`" + Translator.getString(lang, "area", "monster", [id, monsters[i].name, monsters[i].level, monsters[i].type]) + "`\n";
            }
        }


        str += "";
        return str;
    }

    resourcesToString(resources, lang) {
        let strTreesHeader = Emojis.general.axe + " " + Translator.getString(lang, "resources", "woods") + "\n";
        let strTrees = "";

        let strOresHeader = Emojis.general.pickaxe + " " + Translator.getString(lang, "resources", "ores") + "\n";
        let strOres = "";

        let strPlantsHeader = Emojis.general.gloves + " " + Translator.getString(lang, "resources", "plants") + "\n";
        let strPlants = "";

        let str = "";
        let tempString = "";

        let length = 0;

        let resourcesTypesEquivalent = {
            "trees": "wood",
            "ores": "ore",
            "plants": "herb"
        }

        for (let rType in resources) {
            for (let resource of resources[rType]) {
                tempString = Emojis.getString(resourcesTypesEquivalent[rType] + "_" + resource.rarity_shorthand) + "`" + Translator.getString(lang, "area", "resource", [resource.id, resource.name, resource.rarity]) + "`\n";
                switch (rType) {
                    case "trees":
                        strTrees += tempString;
                        break;
                    case "ores":
                        strOres += tempString;
                        break;
                    case "plants":
                        strPlants += tempString;
                        break;

                }
                length++;
            }

        }
        if (length === 0) {
            str += Translator.getString(lang, "resources", "noresources");
        } else {
            str += (strTrees.length > 0 ? strTreesHeader + strTrees + "\n" : "") + (strOres.length > 0 ? strOresHeader + strOres + "\n" : "") + (strPlants.length > 0 ? strPlantsHeader + strPlants + "\n" : "");
        }

        return str + "";
    }

    regionToString(data) {
        let lang = data.lang;
        let region = data.region;
        let strAreas = "`";
        for (let area of region.areas) {
            let values = [area.id, area.name, area.levels];
            switch (area.type) {
                case "wild":
                    strAreas += Translator.getString(lang, "area", "wild_area", values);
                    break;
                case "city":
                    strAreas += Translator.getString(lang, "area", "city_area", values);
                    break;
                case "dungeon":
                    strAreas += Translator.getString(lang, "area", "dungeon_area", values);
                    break;
            }
            strAreas += "\n";
        }
        strAreas += "`"

        let strConnectedAreas = "`";
        for (let area of region.connectedAreas) {
            let values = [area.id, area.name, area.levels];
            switch (area.type) {
                case "wild":
                    strConnectedAreas += Translator.getString(lang, "area", "wild_area", values);
                    break;
                case "city":
                    strConnectedAreas += Translator.getString(lang, "area", "city_area", values);
                    break;
                case "dungeon":
                    strConnectedAreas += Translator.getString(lang, "area", "dungeon_area", values);
                    break;
            }
            strConnectedAreas += " | " + Translator.getString(lang, "area", "region", [area.region_name]) + "\n"
        }
        if (strConnectedAreas == "") {
            strConnectedAreas = Translator.getString(lang, "area", "no_connected_regions");
        }
        strConnectedAreas += "`"

        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(region.name)
            .addField(Translator.getString(lang, "area", "list"), strAreas)
            .addField(Translator.getString(lang, "area", "list_regions_connected"), strConnectedAreas)
            .setImage(region.image);
    }

    bonusesListToStr(data) {
        let str = "```\n";
        str += Translator.getString(data.lang, "area", "bonus_list_header") + "\n\n";
        for (let bonus in data.bonuses) {
            str += bonus + " => " + data.bonuses[bonus] + "\n";
        }
        str += "```";
        return str;
    }

    conquestToStr(data) {
        let lang = data.lang;

        return new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(data.name + " | " + data.levels + " | " + Translator.getString(lang, "area", "owned_by", [data.owner]), data.image)
            .addField(Translator.getString(lang, "area", "conquest"), "```" + data.tournament_info + "```")
            .addField(Translator.getString(lang, "bonuses", "bonuses"), this.bonusesToStr(data))
            .addField(Translator.getString(lang, "area", "area_progression"), this.statsAndLevelToStr(data));
    }

    bonusesToStr(data) {
        let bonuses = data.bonuses;
        let str = "```\n";
        let empty = true;
        for (let bonus of bonuses) {
            if (bonus.percentage > 0) {
                str += bonus.name + " : " + bonus.percentage + "%" + "\n";
                empty = false;
            }
        }

        if (empty) {
            str += Translator.getString(data.lang, "bonuses", "no_bonuses");
        }
        str += "```";
        return str;
    }

    statsAndLevelToStr(data) {
        let lang = data.lang;
        let str = "```\n";
        str += "- " + Translator.getString(lang, "area", "conquest_actual_level", [data.level]) + "\n";
        str += "- " + Translator.getString(lang, "area", "conquest_points_to_distribute", [data.statPoints]) + "\n";
        str += "- " + Translator.getString(lang, "area", "conquest_price_to_next_level", [data.price]) + "\n";
        str += "```";
        return str;
    }


}

module.exports = new Areas();
