var axios = require("axios").default;
axios.defaults.baseURL = "http://localhost:8880";
//axios.defaults.baseURL = "https://api.fight-rpg.com";
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
}

module.exports = Globals;

const User = require("./Users/User");
const ModuleHandler = require("./Modules/ModuleHandler");
