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

const filters = ["rarity", "level_up", "level_down", "type", "subtype", "power_up", "power_down", "name", "rebirth_up", "rebirth_down", "favorite"];

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
    appearancesTypesToText: {
        1: "ear",
        2: "eyes.front",
        3: "eyes.back",
        4: "eyebrow",
        5: "nose",
        6: "facialHair",
        7: "hair.front",
        8: "hair.back",
        9: "mouth.teeths",
        10: "mouth.lips",
        11: "gloves.left.wrist",
        12: "gloves.left.hand",
        13: "gloves.right.wrist",
        14: "gloves.right.hand",
        15: "helmet.back",
        16: "helmet.front",
        17: "armor.body",
        18: "armor.neck",
        19: "armor.lower_left",
        20: "armor.lower_right",
        21: "armor.upper_left",
        22: "armor.upper_right",
        23: "pants.hip",
        24: "pants.lower_left",
        25: "pants.lower_right",
        26: "pants.upper_left",
        27: "pants.upper_right",
        28: "boots.lower_left",
        29: "boots.lower_right",
        30: "boots.foot_left",
        31: "boots.foot_right",
        32: "weapon.main",
        33: "weapon.offhand",
        34: "weapon.shield",
        35: "weapon.bow",
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
    /***
     * @type {import("discord.js").ApplicationCommandData[]}
     */
    commands: [],
    loadCommands: async function () {
        const data = (await axios.get("/helpers/help")).data;

        const languages = Translator.getAvailableLanguages("en");
        const languagesChoices = [];
        for (let i of Object.keys(languages)) {
            languagesChoices.push(
                {
                    name: languages[i],
                    value: i,
                }
            );
        }

        //#region Constants

        const filtersChoices = filters.map((e) => {
            return {
                name: Translator.getString("en", "filters", e),
                value: e
            }
        });
        const itemsChoices = [
            {
                name: "Chest",
                value: "chest"
            },
            {
                name: "Helmet",
                value: "head"
            },
            {
                name: "Pants",
                value: "legs"
            },
            {
                name: "Weapon",
                value: "weapon"
            },
            {
                name: "Mount",
                value: "mount"
            },
        ];
        const typeNameItemChoice = {
            name: "name",
            description: "Name of the equipped type",
            type: "STRING",
            choices: itemsChoices,
            required: true,
        };

        const idCraftOption = {
            name: "idcraft",
            description: "Identifier of the craft",
            type: "STRING",
            required: true,
        };

        const idCollectOption = {
            name: "resource",
            description: "Resource to collect",
            type: "STRING",
            required: true,
            autocomplete: true,
        };

        const idTalentOption = {
            name: "idtalent",
            description: "Identifier of the talent",
            type: "STRING",
            required: true,
            autocomplete: true,
        };

        const idSkillOption = {
            name: "idskill",
            description: "Identifier of the skill",
            type: "STRING",
            required: true,
            autocomplete: true
        };

        const toFightMonsterOption = {
            name: "tofight",
            description: "Monster to fight",
            type: "STRING",
            required: true,
            autocomplete: true,
        };

        const confirmOption = {
            name: "confirm",
            description: "Ignore the confirmation",
            type: "STRING",
            choices: [{
                name: "Ignore Confirmation",
                value: "confirm"
            }],
            required: false,
        };

        const nameOption = {
            name: "name",
            description: "Name",
            type: "STRING",
            required: true,
        }

        const idItemOption = {
            name: "id",
            description: "Item id",
            type: "INTEGER",
            required: true,
        };

        const idItemChoice = {
            name: "id",
            description: "Item id",
            type: "SUB_COMMAND",
            options: [
                idItemOption
            ]
        };
        const itemsSelectOptions = [
            {
                name: "type",
                description: "Item type",
                type: "SUB_COMMAND",
                options: [
                    typeNameItemChoice,
                ]
            },
            idItemChoice
        ];

        const pageOption = {
            name: "page",
            description: "Page to go",
            type: "INTEGER",
            required: false
        };

        const filterSelectOptions = [
            {
                name: "filtername",
                description: "Filter",
                type: "STRING",
                choices: filtersChoices,
                required: false

            },
            {
                name: "filtervalue",
                description: "Filter value",
                type: "STRING",
                required: false,
                autocomplete: true,
            },
            {
                name: "filtername2",
                description: "Filter",
                type: "STRING",
                choices: filtersChoices,
                required: false

            },
            {
                name: "filtervalue2",
                description: "Filter value",
                type: "STRING",
                required: false,
                autocomplete: true,
            },
            {
                name: "filtername3",
                description: "Filter",
                type: "STRING",
                choices: filtersChoices,
                required: false,
            },
            {
                name: "filtervalue3",
                description: "Filter value",
                type: "STRING",
                required: false,
                autocomplete: true,
            },
        ];

        const filterSelectOptionsWithPage = [
            ...filterSelectOptions,
            pageOption
        ];

        const playerOrIdOption = {
            name: "player",
            description: "Player id or @someone",
            type: "STRING",
            required: true
        }

        const playerOrIdOptions = [
            playerOrIdOption
        ];

        const amountOption = {
            name: "amount",
            description: "Amount",
            type: "INTEGER",
            required: false
        };

        const levelOption = {
            name: "level",
            description: "Level",
            type: "INTEGER",
            required: false
        }

        const rebirthLevelOption = {
            name: "rebirthlevel",
            description: "Rebirth level",
            type: "INTEGER",
            required: false
        }

        const secondsOption = {
            name: "seconds",
            description: "Seconds",
            type: "INTEGER",
            required: true,
        }

        //#endregion Constants


        // Load commands
        Globals.commands = [
            {
                name: "equiplist",
                description: Translator.getString("en", "help_panel", "equipment"),
                defaultPermission: true,
            },
            {
                name: "equip",
                description: Translator.getString("en", "help_panel", "equip"),
                options: [{
                    name: "itemid",
                    description: "Item to equip",
                    type: "STRING",
                    required: true
                }],
                defaultPermission: true,
            },
            {
                name: "unequip",
                description: Translator.getString("en", "help_panel", "equip"),
                options: [{
                    name: "itemtype",
                    description: "Item type to unequip",
                    type: "STRING",
                    choices: itemsChoices,
                    required: true
                }],
                defaultPermission: true,
            },
            {
                name: "use",
                description: Translator.getString("en", "help_panel", "use"),
                options: [
                    {
                        name: "itemid",
                        description: "Item to use",
                        type: "STRING",
                        required: true
                    },
                    amountOption
                ],
                defaultPermission: true,
            },
            {
                name: "info",
                description: Translator.getString("en", "help_panel", "info"),
                defaultPermission: true,
            },
            {
                name: "appearance",
                description: Translator.getString("en", "help_panel", "appearance"),
                defaultPermission: true,
            },
            {
                name: "attributes",
                description: Translator.getString("en", "help_panel", "attributes"),
                defaultPermission: true,
            },
            {
                name: "up",
                description: Translator.getString("en", "help_panel", "up"),
                options: [
                    {
                        name: "statname",
                        description: "Stat to distribute",
                        type: "STRING",
                        choices: [
                            {
                                name: Translator.getString("en", "stats", "strength"),
                                value: "str"
                            },
                            {
                                name: Translator.getString("en", "stats", "intellect"),
                                value: "int"
                            },
                            {
                                name: Translator.getString("en", "stats", "constitution"),
                                value: "con"
                            },
                            {
                                name: Translator.getString("en", "stats", "dexterity"),
                                value: "dex"
                            },
                            {
                                name: Translator.getString("en", "stats", "charisma"),
                                value: "cha"
                            },
                            {
                                name: Translator.getString("en", "stats", "will"),
                                value: "will"
                            },
                            {
                                name: Translator.getString("en", "stats", "luck"),
                                value: "luck"
                            },
                            {
                                name: Translator.getString("en", "stats", "wisdom"),
                                value: "wis"
                            },
                            {
                                name: Translator.getString("en", "stats", "perception"),
                                value: "per"
                            },

                        ],
                        required: true
                    },
                    amountOption
                ],
                defaultPermission: true,
            },

            {
                name: "leaderboard",
                description: Translator.getString("en", "help_panel", "leaderboard"),
                options: [
                    {
                        name: "type",
                        description: "Leaderboard type",
                        type: "STRING",
                        choices: [
                            {
                                name: "Arena",
                                value: "arena"
                            },
                            {
                                name: "Gold",
                                value: "gold"
                            },
                            {
                                name: "Characters Level",
                                value: "level"
                            },
                            {
                                name: "Characters craft level",
                                value: "craftlevel"
                            },
                            {
                                name: "Power",
                                value: "power"
                            },
                            {
                                name: "World Boss (Attacks)",
                                value: "wbattacks"
                            },
                            {
                                name: "World Boss (Damage)",
                                value: "wbdamage"
                            },
                            {
                                name: "Achievements",
                                value: "achievements"
                            },
                        ],
                        required: true
                    },
                    pageOption
                ],
                defaultPermission: true,
            },
            {
                name: "reset",
                description: Translator.getString("en", "help_panel", "reset"),
                defaultPermission: true,
            },
            {
                name: "resettalents",
                description: Translator.getString("en", "help_panel", "resettalents"),
                defaultPermission: true,
            },
            {
                name: "achievements",
                description: Translator.getString("en", "help_panel", "achievements"),
                options: [
                    pageOption
                ],
                defaultPermission: true,
            },
            {
                name: "rebirth",
                description: "Rebirth informations",
                options: [
                    {
                        name: "torebirth",
                        description: "Type to rebirth",
                        type: "STRING",
                        choices: [
                            {
                                name: "Level",
                                value: "level"
                            },
                            {
                                name: "Craft Level",
                                value: "level"
                            },
                        ],
                        required: false
                    }
                ],
                defaultPermission: true,
            },
            {
                name: "fight",
                description: Translator.getString("en", "help_panel", "fight"),
                options: [
                    toFightMonsterOption
                ],
                defaultPermission: true,
            },
            {
                name: "arena",
                description: Translator.getString("en", "help_panel", "arena"),
                options: playerOrIdOptions,
                defaultPermission: true,
            },
            {
                name: "Fight in Arena",
                type: "USER",
                defaultPermission: true,
            },
            {
                name: "inventory",
                description: Translator.getString("en", "help_panel", "inv"),
                options: filterSelectOptionsWithPage,
                defaultPermission: true,
            },
            {
                name: "item",
                description: "Shows the information of the selected item",
                options: itemsSelectOptions,
                defaultPermission: true,
            },
            {
                name: "itemfav",
                description: Translator.getString("en", "help_panel", "itemfav"),
                options: itemsSelectOptions,
                defaultPermission: true,
            },
            {
                name: "itemunfav",
                description: Translator.getString("en", "help_panel", "itemunfav"),
                options: itemsSelectOptions,
                defaultPermission: true,
            },
            {
                name: "sell",
                description: Translator.getString("en", "help_panel", "sell"),
                options: [idItemOption],
                defaultPermission: true,
            },
            {
                name: "sellall",
                description: Translator.getString("en", "help_panel", "sellall"),
                options: filterSelectOptions,
                defaultPermission: true,
            },
            {
                name: "sendmoney",
                description: Translator.getString("en", "help_panel", "sendmoney"),
                options: [...playerOrIdOptions, amountOption],
                defaultPermission: true,
            },
            {
                name: "area",
                description: "?",
                defaultPermission: true,

                options: [
                    {
                        name: "info",
                        description: Translator.getString("en", "help_panel", "area"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "conquest",
                        description: Translator.getString("en", "help_panel", "areaconquest"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "levelup",
                        description: Translator.getString("en", "help_panel", "arealevelup"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "bonuseslist",
                        description: Translator.getString("en", "help_panel", "areabonuseslist"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "players",
                        description: Translator.getString("en", "help_panel", "areaplayers"),
                        type: "SUB_COMMAND",
                        options: [pageOption]
                    },
                    {
                        name: "resetbonuses",
                        description: Translator.getString("en", "help_panel", "arearesetbonuses"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "upbonus",
                        description: Translator.getString("en", "help_panel", "areaupbonus"),
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "bonus",
                                description: "Bonus to upgrade",
                                type: "STRING",
                                choices: [
                                    {
                                        name: "Fight XP",
                                        value: "xp_fight",
                                    },
                                    {
                                        name: "Collect XP",
                                        value: "xp_collect",
                                    },
                                    {
                                        name: "Gold Drop",
                                        value: "gold_drop",
                                    },
                                    {
                                        name: "Item Drop",
                                        value: "item_drop",
                                    },
                                    {
                                        name: "Collect Drop",
                                        value: "collect_drop",
                                    },
                                    {
                                        name: "Craft XP",
                                        value: "xp_craft",
                                    },
                                ],
                                required: true,
                            },
                            amountOption
                        ],
                    },
                ]

            },
            {
                name: "region",
                description: Translator.getString("en", "help_panel", "areas"),
                defaultPermission: true,
            },
            {
                name: "travel",
                description: "?",
                options: [
                    {
                        name: "area",
                        description: Translator.getString("en", "help_panel", "travel"),
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "idarea",
                                description: "Id Area to travel",
                                type: "STRING",
                                required: true,
                                autocomplete: true,
                            },
                            confirmOption
                        ],
                    },
                    {
                        name: "region",
                        description: Translator.getString("en", "help_panel", "travelregion"),
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "idregion",
                                description: "Id region to travel",
                                type: "STRING",
                                required: true,
                                autocomplete: true,
                            },
                            confirmOption
                        ],
                    },
                    {
                        name: "direct",
                        description: Translator.getString("en", "help_panel", "traveldirect"),
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "realidarea",
                                description: "Real Id Area to travel",
                                type: "INTEGER",
                                required: true,
                            },
                            confirmOption
                        ],
                    },
                ],
                defaultPermission: true,
            },

            {
                name: "guild",
                description: "?",
                options: [
                    {
                        name: "info",
                        description: Translator.getString("en", "help_panel", "guild"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "list",
                        description: Translator.getString("en", "help_panel", "guilds"),
                        options: [pageOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "create",
                        description: Translator.getString("en", "help_panel", "gcreate"),
                        type: "SUB_COMMAND",
                        options: [nameOption]
                    },
                    {
                        name: "disband",
                        description: Translator.getString("en", "help_panel", "gdisband"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "apply",
                        description: Translator.getString("en", "help_panel", "gapply"),
                        options: [{
                            name: "guildid",
                            description: "Guild identifier",
                            type: "INTEGER",
                            required: true,
                        }],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "accept",
                        description: Translator.getString("en", "help_panel", "gaccept"),
                        options: [{
                            name: "playerid",
                            description: "Player identifier",
                            type: "INTEGER",
                            required: true,
                        }],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "applies",
                        description: Translator.getString("en", "help_panel", "gapplies"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "applyremove",
                        description: Translator.getString("en", "help_panel", "gapplyremove"),
                        options: [{
                            name: "applyid",
                            description: "Appliance identifier",
                            type: "INTEGER",
                            required: true,
                        }],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "appliesremove",
                        description: Translator.getString("en", "help_panel", "gappliesremove"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "announce",
                        description: Translator.getString("en", "help_panel", "gannounce"),
                        options: [{
                            name: "message",
                            description: "Message",
                            type: "STRING",
                            required: true,
                        }],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "addmoney",
                        description: Translator.getString("en", "help_panel", "gaddmoney"),
                        options: [amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "removemoney",
                        description: Translator.getString("en", "help_panel", "gremovemoney"),
                        options: [amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "levelup",
                        description: Translator.getString("en", "help_panel", "glevelup"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "enroll",
                        description: Translator.getString("en", "help_panel", "genroll"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "unenroll",
                        description: Translator.getString("en", "help_panel", "gunenroll"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "leave",
                        description: Translator.getString("en", "help_panel", "gleave"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "mod",
                        description: Translator.getString("en", "help_panel", "gmod"),
                        options: [
                            {
                                name: "playerid",
                                description: "Player identifier",
                                type: "INTEGER",
                                required: true,
                            },
                            {
                                name: "rank",
                                description: "Rank",
                                choices: [
                                    {
                                        name: "Member",
                                        value: 1
                                    },
                                    {
                                        name: "Officer",
                                        value: 2
                                    }
                                ],
                                type: "INTEGER",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "leaderswitch",
                        description: Translator.getString("en", "help_panel", "gleaderswitch"),
                        options: [
                            {
                                name: "playerid",
                                description: "Player identifier",
                                type: "INTEGER",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "rename",
                        description: Translator.getString("en", "help_panel", "grename", [data?.guildsBasePriceLevel]),
                        options: [
                            {
                                name: "newname",
                                description: "New guild name",
                                type: "STRING",
                                required: true,
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "territories",
                        description: Translator.getString("en", "help_panel", "gterritories"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "kick",
                        description: Translator.getString("en", "help_panel", "gkick"),
                        options: [
                            {
                                name: "idcharacter",
                                description: "Character Identifier",
                                type: "INTEGER",
                                required: true,
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "group",
                description: "?",
                options: [
                    {
                        name: "info",
                        description: Translator.getString("en", "help_panel", "grp"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "invite",
                        description: Translator.getString("en", "help_panel", "grpinvite_mention"),
                        options: playerOrIdOptions,
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "leave",
                        description: Translator.getString("en", "help_panel", "grpleave"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "accept",
                        description: Translator.getString("en", "help_panel", "grpaccept"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "decline",
                        description: Translator.getString("en", "help_panel", "grpdecline"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "kick",
                        description: Translator.getString("en", "help_panel", "grpkick"),
                        options: [
                            {
                                name: "nametag",
                                description: "name#tag",
                                type: "STRING",
                                required: true,
                                autocomplete: true
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "swap",
                        description: Translator.getString("en", "help_panel", "grpswap"),
                        options: [
                            {
                                name: "nametag",
                                description: "name#tag",
                                type: "STRING",
                                required: true,
                                autocomplete: true
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "mute",
                        description: Translator.getString("en", "help_panel", "grpmute"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "unmute",
                        description: Translator.getString("en", "help_panel", "grpunmute"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "fight",
                        description: Translator.getString("en", "help_panel", "grpfight"),
                        options: [toFightMonsterOption],
                        type: "SUB_COMMAND",
                    },

                ],
                defaultPermission: true,
            },
            {
                name: "Invite in Group",
                type: "USER",
            },
            {
                name: "marketplace",
                description: "?",
                options: [
                    {
                        name: "mylist",
                        description: Translator.getString("en", "help_panel", "mkmylist"),
                        options: [pageOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "place",
                        description: Translator.getString("en", "help_panel", "mkplace"),
                        options: [
                            {
                                name: "iditem",
                                description: "Item in inventory",
                                type: "INTEGER",
                                required: true,
                            },
                            {
                                name: "number",
                                description: "Number to sell",
                                type: "INTEGER",
                                required: true,
                            },
                            {
                                name: "price",
                                description: "Price to sell",
                                type: "INTEGER",
                                required: true,
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "cancel",
                        description: Translator.getString("en", "help_panel", "mkcancel"),
                        options: [idItemOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "buy",
                        description: Translator.getString("en", "help_panel", "mkbuy"),
                        options: [idItemOption, amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "search",
                        description: Translator.getString("en", "help_panel", "mksearch"),
                        options: [...filterSelectOptions, pageOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "see",
                        description: Translator.getString("en", "help_panel", "mksee"),
                        options: [idItemOption],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "craft",
                description: "?",
                options: [
                    {
                        name: "list",
                        description: Translator.getString("en", "help_panel", "craftlist"),
                        options: [...filterSelectOptions, pageOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "craftshow"),
                        options: [idCraftOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "make",
                        description: Translator.getString("en", "help_panel", "craft"),
                        options: [
                            idCraftOption,
                            {
                                name: "level",
                                description: "Level to craft",
                                type: "INTEGER",
                                required: false,
                            },
                            {
                                name: "rebirthlevel",
                                description: "Rebirth Level to craft (to be valid you must set the level)",
                                type: "INTEGER",
                                required: false,
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "collect",
                description: Translator.getString("en", "help_panel", "collect", [data?.collectTriesOnce]),
                options: [
                    idCollectOption,
                    {
                        name: "amount",
                        description: "Amount to collect",
                        type: "INTEGER",
                        required: false,
                        maxValue: data?.collectTriesOnce,
                    }
                ],
                defaultPermission: true,
            },
            {
                name: "shop",
                description: "?",
                options: [
                    {
                        name: "list",
                        description: Translator.getString("en", "help_panel", "sitems"),
                        options: [pageOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "buy",
                        description: Translator.getString("en", "help_panel", "sbuy"),
                        options: [idItemOption, amountOption],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "worldboss",
                description: "?",
                options: [
                    {
                        name: "fight",
                        description: Translator.getString("en", "help_panel", "wbfight"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "showall",
                        description: Translator.getString("en", "help_panel", "wbshowall"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "lastinfo",
                        description: Translator.getString("en", "help_panel", "wblastinfo"),
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "Propose a Trade",
                type: "USER",
                defaultPermission: true,
            },
            {
                name: "trade",
                description: "?",
                options: [
                    {
                        name: "propose",
                        description: Translator.getString("en", "help_panel", "tpropose"),
                        options: playerOrIdOptions,
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "accept",
                        description: Translator.getString("en", "help_panel", "taccept"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "cancel",
                        description: Translator.getString("en", "help_panel", "tcancel"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "tshow"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "item",
                        description: Translator.getString("en", "help_panel", "titem"),
                        options: [idItemOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "add",
                        description: Translator.getString("en", "help_panel", "tadd"),
                        options: [idItemOption, amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "remove",
                        description: Translator.getString("en", "help_panel", "tremove"),
                        options: [idItemOption, amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "setmoney",
                        description: Translator.getString("en", "help_panel", "tsetmoney"),
                        options: [amountOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "validate",
                        description: Translator.getString("en", "help_panel", "tvalidate").split(".")[0],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "events",
                description: "Group of commands related to events",
                options: [
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "event"),
                        options: [
                            {
                                name: "idevent",
                                description: "Identifier of the event",
                                type: "INTEGER",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "ongoing",
                        description: Translator.getString("en", "help_panel", "event_ongoing"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "incoming",
                        description: "List the incoming events in x months",
                        options: [
                            {
                                name: "months",
                                description: "Number of months to show",
                                type: "INTEGER",
                                required: true,
                                maxValue: 12,
                            },
                            {
                                name: "addtoserver",
                                description: "Add the events to the discord server events (the bot must have the permission)",
                                type: "BOOLEAN",
                                required: false,
                                required: false,
                            }
                        ],
                        type: "SUB_COMMAND",
                    }
                ],
                defaultPermission: true,
            },


            {
                name: "talents",
                description: "?",
                options: [
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "talents"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "export",
                        description: Translator.getString("en", "help_panel", "talentexport"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "import",
                        description: Translator.getString("en", "help_panel", "talentimport"),
                        options: [
                            {
                                name: "importstring",
                                description: "Import string from talentsexport command",
                                type: "STRING",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },

            {
                name: "talent",
                description: "?",
                options: [
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "talentshow"),
                        options: [idTalentOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "up",
                        description: Translator.getString("en", "help_panel", "talentup"),
                        options: [idTalentOption],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },

            {
                name: "skill",
                description: "?",
                options: [
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "skillshow"),
                        options: [idSkillOption],
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },

            {
                name: "build",
                description: "?",
                options: [
                    {
                        name: "show",
                        description: Translator.getString("en", "help_panel", "buildshow"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "add",
                        description: Translator.getString("en", "help_panel", "buildadd"),
                        options: [idSkillOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "remove",
                        description: Translator.getString("en", "help_panel", "buildremove"),
                        options: [idSkillOption],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "move",
                        description: Translator.getString("en", "help_panel", "buildmove"),
                        options: [
                            idSkillOption,
                            {
                                name: "slotnumber",
                                description: "Where to move the skill",
                                type: "INTEGER",
                                required: true,
                                choices: [
                                    { name: "Slot 1", value: 1 },
                                    { name: "Slot 2", value: 2 },
                                    { name: "Slot 3", value: 3 },
                                    { name: "Slot 4", value: 4 },
                                    { name: "Slot 5", value: 5 },
                                ]
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "clear",
                        description: Translator.getString("en", "help_panel", "buildclear"),
                        type: "SUB_COMMAND",
                    },
                ],
                defaultPermission: true,
            },
            {
                name: "other",
                description: "Other commands",
                options: [
                    {
                        name: "help",
                        description: "Show Help",
                        type: "SUB_COMMAND",
                        options: [pageOption]
                    },
                    {
                        name: "botinfo",
                        description: "Show Bot Info",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "lang",
                        description: Translator.getString("en", "help_panel", "lang"),
                        type: "SUB_COMMAND",
                        options: [{
                            name: "language",
                            description: "Allows you to switch languages",
                            type: "STRING",
                            choices: languagesChoices,
                            required: false,
                        }],
                    },
                    {
                        name: "settings",
                        description: Translator.getString("en", "help_panel", "settings"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "setmobile",
                        description: Translator.getString("en", "help_panel", "setmobile"),
                        type: "SUB_COMMAND",
                        options: [{
                            name: "mobiledisplay",
                            description: "Allows you to switch languages",
                            type: "STRING",
                            choices: [
                                {
                                    name: "Desktop",
                                    value: "false",
                                },
                                {
                                    name: "Mobile",
                                    value: "true",
                                }
                            ],
                            required: true,
                        }],
                    },
                    {
                        name: "rarities",
                        description: Translator.getString("en", "help_panel", "rarities"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "types",
                        description: Translator.getString("en", "help_panel", "types"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "vote",
                        description: "Show the vote link",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "resources",
                        description: Translator.getString("en", "help_panel", "resources"),
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "tutorial",
                        description: "Start the tutorial",
                        type: "SUB_COMMAND",
                    }

                ],
                defaultPermission: true,
            },
            {
                name: "admin",
                description: "Admin commands",
                // Todo after discord js update
                // permissions: Globals.admins.map(id => {
                //     return {
                //         id: id,
                //         type: "USER",
                //         permission: true,
                //     }
                // }),
                options: [
                    {
                        name: "load_module",
                        description: "Load a module",
                        options: [
                            {
                                name: "module",
                                description: "Module to load",
                                type: "STRING",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "disable_module",
                        description: "Disable a module",
                        options: [
                            {
                                name: "module",
                                description: "Module to disable",
                                type: "STRING",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "enable_module",
                        description: "Enable a module",
                        options: [
                            {
                                name: "module",
                                description: "Module to enable",
                                type: "STRING",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "load_all_modules",
                        description: "Load all modules",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "disabled_modules",
                        description: "List disabled modules",
                        type: "SUB_COMMAND",
                    },

                    {
                        name: "updatepresence",
                        description: "Update presence",
                        type: "SUB_COMMAND",
                    },

                    {
                        name: "active",
                        description: "Set bot active or not",
                        options: [
                            {
                                name: "value",
                                description: "Value to set",
                                type: "BOOLEAN",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "reload_translations",
                        description: "Reload translations",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "active_players",
                        description: "List active players over x hours",
                        options: [
                            {
                                name: "hours",
                                description: "Hours to check",
                                type: "INTEGER",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "updateslashcommands",
                        description: "Update slash commands",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "testslashcommands",
                        description: "Test slash commands",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "clearslashcommands",
                        description: "Clear slash commands",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "giveme",
                        description: "Give yourself a specific item",
                        options: [
                            idItemOption,
                            amountOption,
                            rebirthLevelOption
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "giveto",
                        description: "Give a specific user a specific item",
                        options: [
                            playerOrIdOption,
                            idItemOption,
                            levelOption,
                            amountOption,
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "mutefor",
                        description: "Mute a user for x seconds",
                        options: [
                            playerOrIdOption,
                            secondsOption,
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "xp",
                        description: "Give self x amount of xp",
                        options: [
                            amountOption,
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "gold",
                        description: "Give self x amount of gold",
                        options: [
                            amountOption,
                            { ...playerOrIdOption, required: false },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "resetfight",
                        description: "Reset fatigue for self",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "debug",
                        description: "Debug command",
                        options: [
                            {
                                name: "value1",
                                description: "Value 1",
                                type: "STRING",
                                required: false
                            },
                            {
                                name: "value2",
                                description: "Value 2",
                                type: "STRING",
                                required: false
                            },
                            {
                                name: "value3",
                                description: "Value 3",
                                type: "STRING",
                                required: false
                            },
                            {
                                name: "value4",
                                description: "Value 4",
                                type: "STRING",
                                required: false
                            },
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "last_command",
                        description: "Get last command",
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "show_all_emojis",
                        description: "Show all emojis",
                        options: [
                            pageOption
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "warn",
                        description: "Warn a user",
                        options: [
                            {
                                name: "players",
                                description: "Players to warn, separated by comma",
                                type: "STRING",
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "eval",
                        description: "Evaluate a string",
                        options: [
                            {
                                name: "string",
                                description: "String to evaluate",
                                type: "STRING",
                                required: true,
                            }
                        ],
                        type: "SUB_COMMAND",
                    },
                    {
                        name: "update_commands_channel",
                        description: "Update commands channel",
                        type: "SUB_COMMAND",
                    }
                ],
                defaultPermission: true,
            }
        ];

        //console.log(Globals.commands[36].options[0]);
    },

    loadHelpPanel: async function () {

        let data = (await axios.get("/helpers/help")).data;
        let filtersString = filters.join(",");

        this.loadCommands();

        for (let lang in Translator.getAvailableLanguages()) {

            Globals.helpPanel[lang] = {};
            Globals.helpPanel[lang][1] = {};

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "equipment_title")] = {
                "equiplist": Translator.getString(lang, "help_panel", "equipment"),
                "equip <itemID>": Translator.getString(lang, "help_panel", "equip"),
                "unequip <itemType>": Translator.getString(lang, "help_panel", "unequip") + " (chest, head, legs, weapon, mount)",
                "use <itemID> <amount>": Translator.getString(lang, "help_panel", "use"),
            };

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "character_title")] = {
                "info": Translator.getString(lang, "help_panel", "info"),
                "appearance": Translator.getString(lang, "help_panel", "appearance"),
                "attributes": Translator.getString(lang, "help_panel", "attributes"),
                "up <statName> <number>": Translator.getString(lang, "help_panel", "up") + " (str, int, con, dex, cha, will, luck, wis, per)",
                "leaderboard <type>": Translator.getString(lang, "help_panel", "leaderboard"),
                "reset": Translator.getString(lang, "help_panel", "reset"),
                "achievements <page>": Translator.getString(lang, "help_panel", "achievements"),
                "rebirth": Translator.getString(lang, "help_panel", "rebirth"),
                "rebirth level": Translator.getString(lang, "help_panel", "rebirth_level"),
                "rebirth craftlevel": Translator.getString(lang, "help_panel", "rebirth_craft_level"),
            };

            Globals.helpPanel[lang][1][Translator.getString(lang, "help_panel", "fight_title")] = {
                "fight <monsterID>": Translator.getString(lang, "help_panel", "fight"),
                "arena @Someone": Translator.getString(lang, "help_panel", "arenaMention"),
                "arena <playerID>": Translator.getString(lang, "help_panel", "arena"),
            }

            // Page 2
            Globals.helpPanel[lang][2] = {};

            Globals.helpPanel[lang][2][Translator.getString(lang, "help_panel", "inventory_title")] = {
                "inventory": Translator.getString(lang, "help_panel", "inv"),
                "inventory <filter> <filterValue>": Translator.getString(lang, "help_panel", "inv_filter", [filtersString]),
                "item id/type <itemID or itemType>": Translator.getString(lang, "help_panel", "item"),
                "itemfav id/type <itemID or itemType>": Translator.getString(lang, "help_panel", "itemfav"),
                "itemunfav id/type <itemID or itemType>": Translator.getString(lang, "help_panel", "itemunfav"),
                "sell <itemID>": Translator.getString(lang, "help_panel", "sell"),
                "sellall": Translator.getString(lang, "help_panel", "sellall"),
                "sellall <filter> <filterValue>": Translator.getString(lang, "help_panel", "sellall_filter", [filtersString]),
                "sendmoney <@mention or idCharacter> <value>": Translator.getString(lang, "help_panel", "sendmoney"),
            }

            Globals.helpPanel[lang][2][Translator.getString(lang, "help_panel", "filters_title")] = {
                "other rarities": Translator.getString(lang, "help_panel", "rarities"),
                "other types": Translator.getString(lang, "help_panel", "types"),
            }

            // Page 3
            Globals.helpPanel[lang][3] = {};

            Globals.helpPanel[lang][3][Translator.getString(lang, "help_panel", "areas_title")] = {
                "area info": Translator.getString(lang, "help_panel", "area"),
                "region": Translator.getString(lang, "help_panel", "areas"),
                "area conquest": Translator.getString(lang, "help_panel", "areaconquest"),
                "area levelup": Translator.getString(lang, "help_panel", "arealevelup"),
                "area bonuseslist": Translator.getString(lang, "help_panel", "areabonuseslist"),
                "area players <page>": Translator.getString(lang, "help_panel", "areaplayers"),
                "area upbonus <bonus_identifier> <pts_to_allocate>": Translator.getString(lang, "help_panel", "areaupbonus"),
                "area resetbonuses": Translator.getString(lang, "help_panel", "arearesetbonuses"),
                "travel area <areaID>": Translator.getString(lang, "help_panel", "travel"),
                "travel region <regionID>": Translator.getString(lang, "help_panel", "travelregion"),
                "travel direct <realAreaID>": Translator.getString(lang, "help_panel", "traveldirect"),
            }

            // Page 4
            Globals.helpPanel[lang][4] = {};

            Globals.helpPanel[lang][4][Translator.getString(lang, "help_panel", "guilds_title")] = {
                "guild info": Translator.getString(lang, "help_panel", "guild"),
                "guild list <page>": Translator.getString(lang, "help_panel", "guilds"),
                "guild create <name>": Translator.getString(lang, "help_panel", "gcreate"),
                "guild disband": Translator.getString(lang, "help_panel", "gdisband"),
                "guild apply <guildID>": Translator.getString(lang, "help_panel", "gapply"),
                "guild accept <playerID>": Translator.getString(lang, "help_panel", "gaccept"),
                "guild applies": Translator.getString(lang, "help_panel", "gapplies"),
                "guild applyremove <applyID>": Translator.getString(lang, "help_panel", "gapplyremove"),
                "guild appliesremove": Translator.getString(lang, "help_panel", "gappliesremove"),
                "guild announce <message>": Translator.getString(lang, "help_panel", "gannounce"),
                "guild addmoney <amount>": Translator.getString(lang, "help_panel", "gaddmoney"),
                "guild removemoney <message>": Translator.getString(lang, "help_panel", "gremovemoney"),
                "guild levelup": Translator.getString(lang, "help_panel", "glevelup"),
                "guild enroll": Translator.getString(lang, "help_panel", "genroll"),
                "guild unenroll": Translator.getString(lang, "help_panel", "gunenroll"),
                "guild leave": Translator.getString(lang, "help_panel", "gleave"),
                "guild mod <playerID> <rank>": Translator.getString(lang, "help_panel", "gmod"),
                "guild leaderswitch <playerID>": Translator.getString(lang, "help_panel", "gleaderswitch"),
                "guild rename \"<name>\"": Translator.getString(lang, "help_panel", "grename", [data?.guildsBasePriceLevel]),
                "guild territories": Translator.getString(lang, "help_panel", "gterritories"),
                "guild kick <idCharacter>": Translator.getString(lang, "help_panel", "gkick"),
            }

            // Page 5
            Globals.helpPanel[lang][5] = {};

            Globals.helpPanel[lang][5][Translator.getString(lang, "help_panel", "groups_title")] = {
                "group info": Translator.getString(lang, "help_panel", "grp"),
                "group invite @mention": Translator.getString(lang, "help_panel", "grpinvite_mention"),
                "group leave": Translator.getString(lang, "help_panel", "grpleave"),
                "group accept": Translator.getString(lang, "help_panel", "grpaccept"),
                "group decline": Translator.getString(lang, "help_panel", "grpdecline"),
                "group kick <name#tag>": Translator.getString(lang, "help_panel", "grpkick"),
                "group swap <name#tag>": Translator.getString(lang, "help_panel", "grpswap"),
                "group mute": Translator.getString(lang, "help_panel", "grpmute"),
                "group unmute": Translator.getString(lang, "help_panel", "grpunmute"),
                "group fight <monsterID>": Translator.getString(lang, "help_panel", "grpfight"),
            }

            Globals.helpPanel[lang][5][Translator.getString(lang, "help_panel", "market_title")] = {
                "marketplace mylist": Translator.getString(lang, "help_panel", "mkmylist"),
                "marketplace place <idItemInInventory> <nb> <price>": Translator.getString(lang, "help_panel", "mkplace"),
                "marketplace cancel <idItem>": Translator.getString(lang, "help_panel", "mkcancel"),
                "marketplace buy <idItem> <amount?>": Translator.getString(lang, "help_panel", "mkbuy"),
                "marketplace search <filter> <filterValue> <page>": Translator.getString(lang, "help_panel", "mksearch", [filtersString]),
                "marketplace see <idItem>": Translator.getString(lang, "help_panel", "mksee"),
            }

            // Page 6
            Globals.helpPanel[lang][6] = {};

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "craft_title")] = {
                "craft list <page>": Translator.getString(lang, "help_panel", "craftlist"),
                "craft show <idCraft>": Translator.getString(lang, "help_panel", "craftshow"),
                "craft make <idCraft> <level?> <rebirthLevel?>": Translator.getString(lang, "help_panel", "craft"),
                "collect <idResource> <number?>": Translator.getString(lang, "help_panel", "collect", [data?.collectTriesOnce]),
            }

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "shop_title")] = {
                "shop list <page?>": Translator.getString(lang, "help_panel", "sitems"),
                "shop buy <idItem> <amount?>": Translator.getString(lang, "help_panel", "sbuy"),
            }

            Globals.helpPanel[lang][6][Translator.getString(lang, "help_panel", "world_boss_title")] = {
                "worldboss fight": Translator.getString(lang, "help_panel", "wbfight"),
                "worldboss showall": Translator.getString(lang, "help_panel", "wbshowall"),
                "worldboss lastinfo": Translator.getString(lang, "help_panel", "wblastinfo"),
            }

            // Page 7
            Globals.helpPanel[lang][7] = {};

            Globals.helpPanel[lang][7][Translator.getString(lang, "help_panel", "trade_title")] = {
                "trade propose @mention": Translator.getString(lang, "help_panel", "tpropose"),
                "trade accept": Translator.getString(lang, "help_panel", "taccept"),
                "trade cancel": Translator.getString(lang, "help_panel", "tcancel"),
                "trade show": Translator.getString(lang, "help_panel", "tshow"),
                "trade item <idInTrade>": Translator.getString(lang, "help_panel", "titem"),
                "trade add <idItemInInventory> <amount?>": Translator.getString(lang, "help_panel", "tadd"),
                "trade remove <idInTrade> <amount?>": Translator.getString(lang, "help_panel", "tremove"),
                "trade setmoney <amount>": Translator.getString(lang, "help_panel", "tsetmoney"),
                "trade validate": Translator.getString(lang, "help_panel", "tvalidate"),
            }

            Globals.helpPanel[lang][7][Translator.getString(lang, "help_panel", "events_title")] = {
                "events show <idEvent>": Translator.getString(lang, "help_panel", "event"),
                "events ongoing": Translator.getString(lang, "help_panel", "event_ongoing"),
            }

            // Page 8
            Globals.helpPanel[lang][8] = {};

            Globals.helpPanel[lang][8][Translator.getString(lang, "help_panel", "other_title")] = {
                "other lang": Translator.getString(lang, "help_panel", "lang"),
                "other lang <languageShort>": Translator.getString(lang, "help_panel", "lang_param"),
                "other settings": Translator.getString(lang, "help_panel", "settings"),
                "other setmobile <arg>": Translator.getString(lang, "help_panel", "setmobile"),
            }

            Globals.helpPanel[lang][8][Translator.getString(lang, "help_panel", "talents_title")] = {
                "talents show": Translator.getString(lang, "help_panel", "talents"),
                "talent show <idTalent>": Translator.getString(lang, "help_panel", "talentshow"),
                "talent up <idTalent>": Translator.getString(lang, "help_panel", "talentup"),
                "skill show <idSkill>": Translator.getString(lang, "help_panel", "skillshow"),
                "build show": Translator.getString(lang, "help_panel", "buildshow"),
                "build add <idSkill>": Translator.getString(lang, "help_panel", "buildadd"),
                "build remove <idSkill>": Translator.getString(lang, "help_panel", "buildremove"),
                "build move <idSkill> <slotNumber>": Translator.getString(lang, "help_panel", "buildmove"),
                "build clear": Translator.getString(lang, "help_panel", "buildclear"),
                "talents export": Translator.getString(lang, "help_panel", "talentexport"),
                "talents import <importString>": Translator.getString(lang, "help_panel", "talentimport"),
                "resettalents": Translator.getString(lang, "help_panel", "resettalents"),
            }

        }

    },
    loadAllAppearances: async function () {
        const data = (await axios.get("helpers/characters/appearances")).data;
        CharacterAppearance.possibleAppearances = data.possibleAppearances;
        CharacterAppearance.bodyAppearances = data.bodyAppearances;

        /**
         * @type {{id:number,link:string,appearanceType:number,idBodyType:number|null,canBeDisplayedOnTop:boolean,linkedTo:number[]}}
         */
        let item;
        for (item of Object.values(CharacterAppearance.possibleAppearances)) {
            if (CharacterAppearance.appearancesPerTypes[item.appearanceType] === undefined) {
                CharacterAppearance.appearancesPerTypes[item.appearanceType] = [];
            }

            CharacterAppearance.appearancesPerTypes[item.appearanceType].push(item);
        }

        //console.log(data.itemsAppearances);
        if (conf.env === "dev") {
            //return;
        }

        const loadingPromises = [];
        for (let appearances of Object.values(data.itemsAppearances)) {
            for (let bodyTypeAppearances of Object.values(appearances)) {
                for (let item of Object.values(bodyTypeAppearances)) {
                    loadingPromises.push(
                        (async () => {
                            const hash = CharacterAppearance.itemAppearanceToHash(item);
                            const filename = hash + ".png";

                            while (CharacterAppearance.itemsCache[hash] == null) {
                                try {
                                    // Test if cdn cache is configured
                                    // If you use this and you try to edit and embed, the image is not updated /!\
                                    if (!conf.cdnAppearanceCache || !hash) {
                                        CharacterAppearance.itemsCache[hash] = await CharacterAppearance.applyColor(item);
                                        return;
                                    }

                                    // Test cache cdn and upload if needed
                                    const dataCache = (await CharacterAppearance.defaultAxios.get("get_cache.php?filename=" + filename)).data;
                                    if (!dataCache.cached) {
                                        await CharacterAppearance.setToCacheOnline(filename, (await CharacterAppearance.applyColor(item)).createPNGStream());
                                    }

                                    CharacterAppearance.itemsCache[hash] = await CharacterAppearance.getImage(conf.cdnAppearanceCache + "images/" + filename);
                                } catch {
                                    console.error("Retrying item: " + filename);
                                }

                            }
                        })()
                    );
                }
            }
        }

        await Promise.all(loadingPromises);
    },
    isLoading: true,
}

module.exports = Globals;

const User = require("./Users/User");
const ModuleHandler = require("./Modules/ModuleHandler");
const Translator = require("./Translator/Translator");
const CharacterAppearance = require("./Drawings/Character/CharacterAppearance");
