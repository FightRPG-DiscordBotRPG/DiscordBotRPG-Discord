const Translator = require("../Translator/Translator");
const Discord = require("discord.js");


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
        let forge;
        let area = data.area;
        let lang = data.lang;
        if (area.craft.isActive == true) {
            forge = "- Blacksmith (Craft : " + Translator.getString(lang, "general", "lvl") + " " + area.craft.minLevel + " - " + area.craft.maxLevel + ")";
        }
        if (!area.haveOwner) {
            area.tax = 0;
        }

        return new Discord.RichEmbed()
            .setColor([0, 255, 0])
            .setAuthor(area.name + " | " + area.levels + " | " + Translator.getString(lang, "area", "owned_by") + " : " + area.owner, area.image)
            .addField(Translator.getString(lang, "general", "description"), area.desc)
            .addField("Services", "```- Marketplace " + "(" + area.tax + "%)" + "\n" + forge + "```")
            .setImage(area.image);

    }

    wildStr(data) {
        let area = data.area;
        let lang = data.lang;

        return new Discord.RichEmbed()
            .setColor([0, 255, 0])
            .setAuthor(area.name + " | " + area.levels + " | " + Translator.getString(lang, "area", "owned_by") + " : " + area.owner, area.image)
            .addField(Translator.getString(lang, "general", "description"), area.desc + "\n\n" + Translator.getString(lang, "area", "minimum_quality") + " **" + area.minimum_quality + "**")
            .addField(Translator.getString(lang, "general", "monsters"), this.monstersToString(area.monsters, lang))
            .addField(Translator.getString(lang, "general", "resources"), this.resourcesToString(area.resources, lang))
            .setImage(area.image);
    }

    dungeonStr(data) {
        this.wildStr(data);
    }

    monstersToString(monsters, lang = "en") {
        let str = "`\n";
        for (let i in monsters) {
            if (monsters[i].number > 1) {
                str += Translator.getString(lang, "area", "monster_group", [i, monsters[i].name, monsters[i].number - 1, monsters[i].level, monsters[i].type]) + "\n";
            } else {
                str += Translator.getString(lang, "area", "monster", [i, monsters[i].name, monsters[i].level, monsters[i].type]) + "\n";
            }
        }
        str += "`";
        return str;
    }

    resourcesToString(resources, lang) {
        let strTreesHeader = Translator.getString(lang, "resources", "woods") + "\n";
        let strTrees = "";

        let strOresHeader = Translator.getString(lang, "resources", "ores") + "\n";
        let strOres = "";

        let strPlantsHeader = Translator.getString(lang, "resources", "plants") + "\n";
        let strPlants = "";

        let str = "`" + "\n";
        let tempString = "";

        let length = 0;

        for (let rType in resources) {
            for (let resource of resources[rType]) {
                tempString = Translator.getString(lang, "area", "resource", [resource.id, resource.name, resource.rarity]) + "\n";
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
            str += (strTrees.length > 0 ? strTreesHeader + strTrees : "") + (strOres.length > 0 ? strOresHeader + strOres : "") + (strPlants.length > 0 ? strPlantsHeader + strPlants : "");
        }

        return str + "`";
    }

    regionToString(data) {
        let lang = data.lang;
        let region = data.region;
        let strAreas = "";

        for (let area of region.areas) {
            strAreas += "`";
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
            strAreas += "`\n";
        }

        let strConnectedAreas = "";
        for (let area of region.connectedAreas) {
            strConnectedAreas += "`"
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
            strConnectedAreas += " | " + Translator.getString(lang, "general", "region") + " : " + area.region_name + "`\n"
        }
        if (strConnectedAreas == "") {
            strConnectedAreas = Translator.getString(lang, "area", "no_connected_regions");
        }

        return new Discord.RichEmbed()
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

        return new Discord.RichEmbed()
            .setColor([0, 255, 0])
            .setAuthor(data.name + " | " + data.levels + " | " + Translator.getString(lang, "area", "owned_by") + " : " + data.owner, data.image)
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
                str += bonus.name + " : " + bonus.percentage + "\n";
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
        let str = "```\n";
        str += "- Actual level : " + data.level + "\n";
        str += "- Points to distribute : " + data.statPoints + "\n";
        str += "- Price to next level : " + data.price + "\n";
        str += "```";
        return str;
    }


}

module.exports = new Areas();