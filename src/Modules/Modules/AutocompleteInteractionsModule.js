const GModule = require("../GModule");
const Globals = require("../../Globals");
const InteractContainer = require("../../Discord/InteractContainer");
const User = require("../../Users/User");
const WildArea = require("../../Drawings/Areas/WildArea");
const Region = require("../../Drawings/Areas/Region");
const Translator = require("../../Translator/Translator");
const Talents = require("../../Drawings/Character/Talents");

const FindTypes = {
    "StartsWith": 1,
    "Contains": 2,
}

let RaritiesByLang = {};
let ItemsTypesByLang = {};
let ItemsSubtypesByLang = {};

class AutocompleteInteractionsModule extends GModule {
    constructor() {
        super();
        this.commands = [];
        this.startLoading("AutocompleteInteractionsModule");
        this.init();
        this.endLoading("AutocompleteInteractionsModule");
    }

    init() {
        RaritiesByLang = this.getFromTranslatorAnArrayOfTranslatedStringsFromType("rarities");
        ItemsTypesByLang = this.getFromTranslatorAnArrayOfTranslatedStringsFromType("item_types");
        ItemsSubtypesByLang = this.getFromTranslatorAnArrayOfTranslatedStringsFromType("item_sous_types");
    }

    getFromTranslatorAnArrayOfTranslatedStringsFromType(type) {
        // We are using this function since performance doesn't really matter and we prefer readability
        const resp = {};
        for (let lang in Translator.translations) {
            resp[lang] = [];
            for (let rarity in Translator.translations["en"][type]) {
                // So we got the error message if not translated
                resp[lang].push(Translator.getString(lang, type, rarity));
            }
        }

        return resp;
    }


    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        /**
         * @type {User}
         **/
        let user = Globals.connectedUsers[interact.author.id];
        let axios = user.getAxios();
        let data = null;
        let response = null;
        let typeFind = FindTypes.Contains;


        if (interact.interaction.responded) {
            return;
        }

        switch (command) {
            case "fight":
            case "groupfight":
                data = (await axios.get("/game/travel/area/monsters")).data;
                response = data.monsters.map((e, i) => {
                    return {
                        name: WildArea.monsterToString(e, i, false, user.lang),
                        value: (i + 1).toString()
                    }
                });
                break;
            case "travelarea":
                data = (await axios.get("/game/travel/region")).data;
                response = data.region.areas.map((e, i) => {
                    return {
                        name: Region.areaToString(e, user.lang),
                        value: (i + 1).toString()
                    }
                });
                break;
            case "travelregion":
                data = (await axios.get("/game/travel/region")).data;
                response = data.region.connectedAreas.map((e, i) => {
                    return {
                        name: Region.areaToString(e, user.lang),
                        value: (i + 1).toString()
                    }
                });
                break;
            case "collect":
                data = (await axios.get("/game/travel/area/resources")).data;
                response = this.areaResourcesToResponse(data.resources, user.lang);
                break;
            case "buildadd":
            case "skillshow":
                data = (await axios.get("/game/character/skills/unlocked")).data;
                response = data.unlockedSkills.filter(e => !e.isEquipped).map((e) => {
                    return {
                        name: e.name,
                        value: e.id.toString()
                    }
                });
                break;
            case "buildremove":
            case "buildmove":
                data = (await axios.get("/game/character/build/show/simple")).data;
                response = data.build.map((e) => {
                    return {
                        name: e.name,
                        value: e.id.toString()
                    }
                });
                break;
            case "talentup":
                data = (await axios.get("/game/character/talents/visible")).data;
                response = Talents.getAllNodes(data, false, true);
                break;
            case "talentshow":
                data = (await axios.get("/game/character/talents/visible")).data;
                response = Talents.getAllNodes(data, true);
                break;
            case "inventory":
            case "marketplacesearch":
            case "craftlist":
                // Take before last argument and use getFiltersResponses to get the filters if args.length > 1
                if (args.length > 1) {
                    response = this.getFiltersResponses(args[args.length - 2], user.lang)
                }
                break;

        }

        if (response != null) {

            // Filter starting with first element of args
            if (args.length > 0) {
                if (typeFind == FindTypes.StartsWith) {
                    response = response.filter(e => e.name.toLowerCase().startsWith(args[args.length - 1].toLowerCase()));
                } else if (typeFind == FindTypes.Contains) {
                    response = response.filter(e => e.name.toLowerCase().includes(args[args.length - 1].toLowerCase()));
                }
            }

            // Take the first 25 elements at max
            response = response.slice(0, 25);

            interact.interaction.respond(response);
        }

    }

    areaResourcesToResponse(resources, lang = "en") {
        let response = [];
        for (let rType in resources) {
            for (let resource of resources[rType]) {
                response.push({
                    name: Translator.getString(lang, "area", "resource", [resource.id, resource.name, resource.rarity]),
                    value: resource.id.toString()
                });
            }
        }

        return response;
    }

    getFiltersResponses(type, lang = "en") {
        // Using switch because it's faster than lookup table
        // See /scripts/Benchmark.js and test it yourself, ~60% faster
        // Since this may be use multiple times, performance may matters if the shard is on big servers
        switch (type) {
            case "favorite":
                return [
                    {
                        name: Translator.getString(lang, "general", "yes"),
                        value: "true",
                    },
                    {
                        name: Translator.getString(lang, "general", "no"),
                        value: "false",
                    }
                ];
            case "rarity":
                return this.getFilterFromArray(RaritiesByLang[lang]);
            case "type":
                return this.getFilterFromArray(ItemsTypesByLang[lang]);
            case "subtype":
                return this.getFilterFromArray(ItemsSubtypesByLang[lang]);
        }
        return [];
    }

    /**
     * 
     * @param {Object<string, string[]>} currentFilters 
     * @param {string} lang 
     * @returns 
     */
    getFilterFromArray(currentFilters) {
        return currentFilters.map((e) => {
            return {
                name: e,
                value: e.toLowerCase()
            }
        });
    }
}

module.exports = AutocompleteInteractionsModule;