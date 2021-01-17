const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Utils = require("../../Utils");
const User = require("../../Users/User");
const TextDrawings = require("../TextDrawings");
const Moment = require("moment");
const Area = require("./Area");

class WildArea extends Area {
	constructor() {
		super();
		this.displayMonsters = true;
        this.displayResources = true;
        this.type = "WildArea";
	}

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
	toString(data, user) {
		let embed = super.toString(data, user);
		let area = data.area;
		let lang = data.lang;

		embed = embed
			.addField(Translator.getString(lang, "area", "minimum_quality"), Emojis.getRarityEmoji(area.minimum_quality_shorthand) + " **" + area.minimum_quality + "** ", true)
			.addField(Translator.getString(lang, "area", "maximum_quality"), Emojis.getRarityEmoji(area.maximum_quality_shorthand) + " **" + area.maximum_quality + "** ", true);

        if (this.displayMonsters) {
			embed = embed.addField(Translator.getString(lang, "general", "monsters"), this.monstersToString(area.monsters, lang));
		}

		if (this.displayResources) {
			embed = embed.addField(Translator.getString(lang, "general", "resources"), this.resourcesToString(area.resources, lang));
		}

		return embed;
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



	disableAll() {
		super.disableAll();
		this.displayMonsters = false;
		this.displayResources = false;
    }

    enableAll() {
        super.enableAll();
        this.displayMonsters = true;
        this.displayResources = true;
    }

}

module.exports = WildArea;