var axios = require("axios").default;
const conf = require("../conf/conf");
axios.defaults.baseURL = "https://api.fight-rpg.com";
if (conf.env === "dev") {
    axios.defaults.baseURL = "http://localhost:8880";
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 300 || status >= 400 && status < 500; // default
}


var Globals = {
    /**
     * @type {Object<string, User>}
     */
    connectedUsers: {},
    ownerID: "241564725870198785",
    admins: ["241564725870198785", "285789367954440194", "228787710607753216", "403229406585421834", "245858206021058560"],
    tutorialLink: "https://wiki.fight-rpg.com/doku.php?id=en:starter_guide",
    getRarityName: (idRarity) => {
        idRarity = parseInt(idRarity);
        let rarityName = "";
        switch (idRarity) {
            case 1:
                rarityName = "common";
                break;
            case 2:
                rarityName = "rare";
                break;
            case 3:
                rarityName = "superior";
                break;
            case 4:
                rarityName = "epic";
                break;
            case 5:
                rarityName = "legendary";
                break;
            case 6:
                rarityName = "mythic";
                break;
        }
        return rarityName;
    },
    getTypeName: (idType) => {
        idType = parseInt(idType);
        let typeName = "";
        switch (idType) {
            case 1:
                typeName = "weapon"
                break;
            case 2:
                typeName = "chest"
                break;
            case 3:
                typeName = "legs"
                break;
            case 4:
                typeName = "head"
                break;
            case 5:
                typeName = "resource"
                break;
            case 6:
                typeName = "potion"
                break;
            case 7:
                typeName = "lootbox"
                break;
            case 8:
                typeName = "mount"
                break;
        }
        return typeName;
    },
    getSubtypeName: (idSubtype) => {
        idSubtype = parseInt(idSubtype);
        return Globals.subtypesIdsToText[idSubtype];
    },
    raritiesByLang: {},
    typesByLang: {},
    subtypesByLang: {},
    yesNoByLang: {},
    subtypesIdsToText: {
        1: "ore",
        2: "plant",
        3: "wood",
        4: "sword",
        5: "whip",
        6: "metal",
        7: "random_loot_box_equipment",
        8: "random_loot_box_equipment",
        9: "reset_time_potion",
        10: "founder_box",
        11: "horse",
        12: "random_loot_box_equipment",
        13: "crystal",
        14: "energy_potion",
        15: "salamander",
        16: "camel",
        17: "polar_bear",
        18: "cloth",
        19: "leather",
        20: "bow",
        21: "dagger",
        22: "wand",
        23: "staff",
    },
    /**
     * @type {ModuleHandler}
     */
    moduleHandler: null,
    /**
     * Minutes before disconnecting
     */
    inactiveTimeBeforeDisconnect: 30,
    antiSpamNumberOfTries: 3,
    antiSpamMinutesOfBan: 30,
    helpPanel: {},
    loadHelpPanel: async function () {

        let data = (await axios.get("/helpers/help")).data;
        let filters = ["rarity", "level", "level_down", "type", "subtype", "power", "power_down", "name", "rebirth", "rebirth_down"];
        let filtersString = filters.join(",");

        for (let lang in Translator.getAvailableLanguages()) {

            Globals.helpPanel[lang] = {};
            Globals.helpPanel[lang][1] = {};

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "equipment_title")] = {
                "equipment/equiplist": Translator.getString(lang, "help_panel", "equipment"),
                "equip <itemID>": Translator.getString(lang, "help_panel", "equip"),
                "unequip <itemType>": Translator.getString(lang, "help_panel", "unequip") + " (chest, head, legs, weapon, horse)",
                "use <itemID> <amount>": Translator.getString(lang, "help_panel", "use"),
            };

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "character_title")] = {
                "info/profile": Translator.getString(lang, "help_panel", "info"),
                "attributes": Translator.getString(lang, "help_panel", "attributes"),
                "up <statName> <number>": Translator.getString(lang, "help_panel", "up") + " (str, int, con, dex, cha, will, luck, wis, per)",
                "leaderboard <arg>": Translator.getString(lang, "help_panel", "leaderboard"),
                "reset": Translator.getString(lang, "help_panel", "reset"),
                "resettalents": Translator.getString(lang, "help_panel", "resettalents"),
                "achievements <page>": Translator.getString(lang, "help_panel", "achievements"),
                "rebirth": Translator.getString(lang, "help_panel", "rebirth"),
                "rebirth level": Translator.getString(lang, "help_panel", "rebirth_level"),
                "rebirth craftlevel": Translator.getString(lang, "help_panel", "rebirth_craft_level"),
            };

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "fight_title")] = {
                "fight <monsterID>": Translator.getString(lang, "help_panel", "fight"),
                "grpfight <monsterID>": Translator.getString(lang, "help_panel", "grpfight"),
                "arena @Someone": Translator.getString(lang, "help_panel", "arenaMention"),
                "arena <playerID>": Translator.getString(lang, "help_panel", "arena"),
            }

            // Page 2
            Globals.helpPanel[lang][2] = {};

            Globals.helpPanel[lang][2][Translator.getString(lang, "help_panel", "inventory_title")] = {
                "inv/inventory": Translator.getString(lang, "help_panel", "inv"),
                "inv/inventory <filter> <filterValue>": Translator.getString(lang, "help_panel", "inv_filter", [filtersString]),
                "item <itemID>": Translator.getString(lang, "help_panel", "item"),
                "itemfav <itemID or itemType>": Translator.getString(lang, "help_panel", "itemfav"),
                "itemunfav <itemID or itemType>": Translator.getString(lang, "help_panel", "itemunfav"),
                "sell <itemID>": Translator.getString(lang, "help_panel", "sell"),
                "sellall": Translator.getString(lang, "help_panel", "sellall"),
                "sellall <filter> <filterValue> <page>": Translator.getString(lang, "help_panel", "sellall_filter", [filtersString]),
                "sendmoney <@mention or idCharacter> <value>": Translator.getString(lang, "help_panel", "sendmoney"),
            }

            Globals.helpPanel[lang][2][Translator.getString(lang, "help_panel", "filters_title")] = {
                "rarities": Translator.getString(lang, "help_panel", "rarities"),
                "types": Translator.getString(lang, "help_panel", "types"),
            }

            // Page 3
            Globals.helpPanel[lang][3] = {};

            Globals.helpPanel[lang][3][Translator.getString(lang, "help_panel", "areas_title")] = {
                "area": Translator.getString(lang, "help_panel", "area"),
                "areas/regions": Translator.getString(lang, "help_panel", "areas"),
                "areaconquest": Translator.getString(lang, "help_panel", "areaconquest"),
                "arealevelup": Translator.getString(lang, "help_panel", "arealevelup"),
                "areabonuseslist": Translator.getString(lang, "help_panel", "areabonuseslist"),
                "areaplayers <page>": Translator.getString(lang, "help_panel", "areaplayers"),
                "areaupbonus <bonus_identifier> <pts_to_allocate>": Translator.getString(lang, "help_panel", "areaupbonus"),
                "travel <areaID>": Translator.getString(lang, "help_panel", "travel"),
                "travelregion <regionID>": Translator.getString(lang, "help_panel", "travelregion"),
                "traveldirect <realAreaID>": Translator.getString(lang, "help_panel", "traveldirect"),
                "arearesetbonuses": Translator.getString(lang, "help_panel", "arearesetbonuses"),
            }

            // Page 4
            Globals.helpPanel[lang][4] = {};

            Globals.helpPanel[lang][4][Translator.getString(lang, "help_panel", "guilds_title")] = {
                "guild": Translator.getString(lang, "help_panel", "guild"),
                "guilds <page>": Translator.getString(lang, "help_panel", "guilds"),
                "gcreate \"<name>\"": Translator.getString(lang, "help_panel", "gcreate"),
                "gdisband": Translator.getString(lang, "help_panel", "gdisband"),
                "gapply <guildID>": Translator.getString(lang, "help_panel", "gapply"),
                "gaccept <playerID>": Translator.getString(lang, "help_panel", "gaccept"),
                "gapplies": Translator.getString(lang, "help_panel", "gapplies"),
                "gapplyremove <applyID>": Translator.getString(lang, "help_panel", "gapplyremove"),
                "gappliesremove": Translator.getString(lang, "help_panel", "gappliesremove"),
                "gannounce <message>": Translator.getString(lang, "help_panel", "gannounce"),
                "gaddmoney <amount>": Translator.getString(lang, "help_panel", "gaddmoney"),
                "gremovemoney <message>": Translator.getString(lang, "help_panel", "gremovemoney"),
                "glevelup": Translator.getString(lang, "help_panel", "glevelup"),
                "genroll": Translator.getString(lang, "help_panel", "genroll"),
                "gunenroll": Translator.getString(lang, "help_panel", "gunenroll"),
                "gleave": Translator.getString(lang, "help_panel", "gleave"),
                "gmod <playerID> <rank>": Translator.getString(lang, "help_panel", "gmod"),
                "gleaderswitch <playerID>": Translator.getString(lang, "help_panel", "gleaderswitch"),
                "grename \"<name>\"": Translator.getString(lang, "help_panel", "grename", [data?.guildsBasePriceLevel]),
                "gterritories": Translator.getString(lang, "help_panel", "gterritories"),
                "gkick <idCharacter>": Translator.getString(lang, "help_panel", "gkick"),
            }

            // Page 5
            Globals.helpPanel[lang][5] = {};

            Globals.helpPanel[lang][5][Translator.getString(lang, "help_panel", "groups_title")] = {
                "grp": Translator.getString(lang, "help_panel", "grp"),
                "grpinvite @mention": Translator.getString(lang, "help_panel", "grpinvite_mention"),
                "grpleave": Translator.getString(lang, "help_panel", "grpleave"),
                "grpaccept": Translator.getString(lang, "help_panel", "grpaccept"),
                "grpdecline": Translator.getString(lang, "help_panel", "grpdecline"),
                "grpkick \"<name#tag>\"": Translator.getString(lang, "help_panel", "grpkick"),
                "grpswap \"<name#tag>\"": Translator.getString(lang, "help_panel", "grpswap"),
                "grpmute": Translator.getString(lang, "help_panel", "grpmute"),
                "grpunmute": Translator.getString(lang, "help_panel", "grpunmute"),
            }

            Globals.helpPanel[lang][5][Translator.getString(lang, "help_panel", "market_title")] = {
                "mkmylist": Translator.getString(lang, "help_panel", "mkmylist"),
                "mkplace <idItemInInventory> <nb> <price>": Translator.getString(lang, "help_panel", "mkplace"),
                "mkcancel <idItem>": Translator.getString(lang, "help_panel", "mkcancel"),
                "mkbuy <idItem>": Translator.getString(lang, "help_panel", "mkbuy"),
                "mkshow/mksearch <filter> <filterValue> <page>": Translator.getString(lang, "help_panel", "mksearch", [filtersString]),
                "mksee <idItem>": Translator.getString(lang, "help_panel", "mksee"),
            }

            // Page 6
            Globals.helpPanel[lang][6] = {};

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "craft_title")] = {
                "craftlist <page>": Translator.getString(lang, "help_panel", "craftlist"),
                "craftshow <idCraft>": Translator.getString(lang, "help_panel", "craftshow"),
                "craft <idCraft> <?level> <?rebirthLevel>": Translator.getString(lang, "help_panel", "craft"),
                "collect <idResource> <number>": Translator.getString(lang, "help_panel", "collect", [data?.collectTriesOnce]),
            }

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "shop_title")] = {
                "sitems/shop <page>": Translator.getString(lang, "help_panel", "sitems"),
                "sbuy <idItem> <amount>": Translator.getString(lang, "help_panel", "sbuy"),
            }

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "world_boss_title")] = {
                "wbfight/wbattack": Translator.getString(lang, "help_panel", "wbfight"),
                "wbshowall": Translator.getString(lang, "help_panel", "wbshowall"),
                "wblastinfo": Translator.getString(lang, "help_panel", "wblastinfo"),
                "wbleaderboard <type>": Translator.getString(lang, "help_panel", "wbleaderboard"),
            }

            // Page 7
            Globals.helpPanel[lang][7] = {};

            Globals.helpPanel[lang][7][Translator.getString(lang, "help_panel", "trade_title")] = {
                "tpropose @mention": Translator.getString(lang, "help_panel", "tpropose"),
                "taccept": Translator.getString(lang, "help_panel", "taccept"),
                "tcancel": Translator.getString(lang, "help_panel", "tcancel"),
                "tshow": Translator.getString(lang, "help_panel", "tshow"),
                "titem <idInTrade>": Translator.getString(lang, "help_panel", "titem"),
                "tadd <idItemInInventory> <amount>": Translator.getString(lang, "help_panel", "tadd"),
                "tremove <idInTrade> <amount>": Translator.getString(lang, "help_panel", "tremove"),
                "tsetmoney <amount>": Translator.getString(lang, "help_panel", "tsetmoney"),
                "tvalidate": Translator.getString(lang, "help_panel", "tvalidate"),
            }

            // Page 8
            Globals.helpPanel[lang][8] = {};

            Globals.helpPanel[lang][8][Translator.getString(lang, "help_panel", "other_title")] = {
                "lang": Translator.getString(lang, "help_panel", "lang"),
                "lang <languageShort>": Translator.getString(lang, "help_panel", "lang_param"),
                "settings": Translator.getString(lang, "help_panel", "settings"),
                "setmobile <arg>": Translator.getString(lang, "help_panel", "setmobile"),
            }

            Globals.helpPanel[lang][8][Translator.getString(lang, "help_panel", "talents_title")] = {
                "talents": Translator.getString(lang, "help_panel", "talents"),
                "talentshow <idTalent>": Translator.getString(lang, "help_panel", "talentshow"),
                "talentup <idTalent>": Translator.getString(lang, "help_panel", "talentup"),
                "skillshow <idSkill>": Translator.getString(lang, "help_panel", "skillshow"),
                "buildshow": Translator.getString(lang, "help_panel", "buildshow"),
                "buildadd <idSkill>": Translator.getString(lang, "help_panel", "buildadd"),
                "buildremove <idSkill>": Translator.getString(lang, "help_panel", "buildremove"),
                "buildmove <idSkill> <slotNumber>": Translator.getString(lang, "help_panel", "buildmove"),
                "buildclear": Translator.getString(lang, "help_panel", "buildclear"),
                "talentsexport": Translator.getString(lang, "help_panel", "talentexport"),
                "talentsimport <importString>": Translator.getString(lang, "help_panel", "talentimport"),
                "resettalents": Translator.getString(lang, "help_panel", "resettalents"),
            }

        }

    },
}

module.exports = Globals;

const User = require("./Users/User");
const ModuleHandler = require("./Modules/ModuleHandler");
const Translator = require("./Translator/Translator");
