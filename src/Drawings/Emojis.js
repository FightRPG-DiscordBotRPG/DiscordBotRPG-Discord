const conf = require("../../conf/conf");

class Emojis {
    static getID(emojiName) {
        let em;
        if (conf.env === "prod") {
            em = Emojis.emojisProd[emojiName];
        } else {
            em = Emojis.emojisDev[emojiName];
            em = em != null ? em : Emojis.emojisProd[emojiName];
        }
        return em != null ? em.id : Emojis.general[emojiName];
    }

    static getString(emojiName) {
        let em;
        if (conf.env === "prod") {
            em = Emojis.emojisProd[emojiName];
        } else {
            em = Emojis.emojisDev[emojiName];
            em = em != null ? em : Emojis.emojisProd[emojiName];
        }
        return em != null ? em.string : Emojis.general[emojiName];
    }

    static getWeatherEmoji(weatherShorthand) {
        if (Emojis.weather[weatherShorthand]) {
            return Emojis.getString(Emojis.weather[weatherShorthand]);
        } else {
            return Emojis.getString("thermometer");
        }
    }

    static getItemTypeEmoji(typeShorthand) {
        return Emojis.typeItem[typeShorthand] ? Emojis.typeItem[typeShorthand] : Emojis.general.q_mark;
    }

    static getRarityEmoji(rarityShorthand) {
        return Emojis.getString("rarity_" + rarityShorthand);
    }

    static getItemSubTypeEmoji(subtypeShorthand) {
        return Emojis.subtypeItem[subtypeShorthand] ? Emojis.subtypeItem[subtypeShorthand] : Emojis.general.q_mark;
    }

    static getAreaTypeEmoji(typeShorthand) {
        return Emojis.areaType[typeShorthand] ? Emojis.areaType[typeShorthand] : Emojis.general.q_mark;
    }

    static getAreaBonusEmoji(bonusIdentifier) {
        return Emojis.areaBonus[bonusIdentifier] ? Emojis.areaBonus[bonusIdentifier] : Emojis.general.books;
    }

    static getResourceSubtype(subtypeShorthand, rarityShorthand) {
        let resourcesTypesEquivalent = {
            "plant": "herb"
        }

        subtypeShorthand = resourcesTypesEquivalent[subtypeShorthand] ? resourcesTypesEquivalent[subtypeShorthand] : subtypeShorthand;

        let emoji = this.getString(subtypeShorthand + "_" + rarityShorthand);

        return emoji != null ? emoji : this.getItemSubTypeEmoji(subtypeShorthand);
    }

    static getEntityTypeEmoji(type) {
        return Emojis.entitiesTypes[type] ? Emojis.entitiesTypes[type] : Emojis.general.person;
    }

}


Emojis.weather = {
    "sunny": "sun",
    "cloudy": "cloud",
    "foggy": "fog",
    "rainy": "rain",
    "rainstorm": "rainstorm",
    "snowy": "snow",
    "firestorm": "fire",
    "sandstorm": "tornado",
    "snowstorm": "snowflake"
};

Emojis.emojisProd = {
    "honor": {
        id: "403824433837637632",
        string: "<:honor:403824433837637632>"
    },
    "rusty_broken_sword": {
        id: "525603434993549312",
        string: "<:rusty_broken_sword:525603434993549312>"
    },
    "rusty_sword": {
        id: "525603420128935937",
        string: "<:rusty_sword:525603420128935937>"
    },
    "sword2": {
        id: "525602381258293248",
        string: "<:sword2:525602381258293248>"
    },
    "gold_sword": {
        id: "525602353009917952",
        string: "<:gold_sword:525602353009917952>"
    },
    "monster": {
        id: "403149357387350016",
        string: "<:monstre:403149357387350016>"
    },
    "sword": {
        id: "403574088389361666",
        string: "<:sword:403574088389361666>"
    },
    "win": {
        id: "403151177153249281",
        string: "<:win:403151177153249281>"
    },
    "idFRPG": {
        id: "523462148412932105",
        string: "<:idFRPG:523462148412932105>"
    },
    "levelup": {
        id: "403456740139728906",
        string: "<:levelup:403456740139728906>"
    },
    "exp": {
        id: "554308999760052242",
        string: "<:exp:554308999760052242>"
    },
    "bar_white": {
        id: "704023285586722837",
        string:"<:bar_white:704023285586722837>"
    },
    "bar_white_empty": {
        id: "704023285897363486",
        string: "<:bar_white_empty:704023285897363486>"
    },
    "bar_red": {
        id: "704023285574402138",
        string: "<:bar_red:704023285574402138>"
    },
    "bar_red_empty": {
        id: "704023285339521177",
        string: "<:bar_red_empty:704023285339521177>"
    },
    "bar_blue": {
        id: "704023285616345311",
        string: "<:bar_blue:704023285616345311>"
    },
    "bar_blue_empty": {
        id: "704023285771272212",
        string: "<:bar_blue_empty:704023285771272212>"
    },
    "bar_yellow": {
        id: "704023285574271136",
        string: "<:bar_yellow:704023285574271136>"
    },
    "bar_yellow_empty": {
        id: "704023285607956591",
        string: "<:bar_yellow_empty:704023285607956591>"
    },
    "bar_green": {
        id: "704023285590917191",
        string: "<:bar_green:704023285590917191>"
    },
    "bar_green_empty": {
        id: "704023285620539402",
        string: "<:bar_green_empty:704023285620539402>"
    },
    "treasure": {
        id: "403457812535181313",
        string: "<:treasure:403457812535181313>"
    },
    "loose": {
        id: "403153660756099073",
        string: "<:loose:403153660756099073>"
    },
    "elite": {
        id: "406090076511141888",
        string: "<:elite:406090076511141888>"
    },
    "boss": {
        id: "456113364687388683",
        string: "<:boss:456113364687388683>"
    },
    "rarity_common": {
        id: "704020575705628762",
        string: "<:rarity_common:704020575705628762>"
    },
    "rarity_rare": {
        id: "704020574871093362",
        string: "<:rarity_rare:704020574871093362>"
    },
    "rarity_superior": {
        id: "704020574938333225",
        string: "<:rarity_superior:704020574938333225>"
    },
    "rarity_epic": {
        id: "704020575193923645",
        string: "<:rarity_epic:704020575193923645>"
    },
    "rarity_legendary": {
        id: "704020575609159811",
        string: "<:rarity_legendary:704020575609159811>"
    },
    "rarity_mythic": {
        id: "704020575462490222",
        string: "<:rarity_mythic:704020575462490222>"
    },
    "wood_common": {
        id: "703958796351045632",
        string: "<:wood_common:703958796351045632>"
    },
    "wood_rare": {
        id: "703958796065833130",
        string: "<:wood_rare:703958796065833130>"
    },
    "wood_superior": {
        id: "703958796531138580",
        string: "<:wood_superior:703958796531138580>"
    },
    "wood_epic": {
        id: "703964718171422820",
        string: "<:wood_epic:703964718171422820>"
    },
    "wood_legendary": {
        id: "703964718213365770",
        string: "<:wood_legendary:703964718213365770>"
    },
    "wood_mythic": {
        id: "703958796757762048",
        string: "<:wood_mythic:703958796757762048>"
    },
    "ore_common": {
        id: "703958795591614485",
        string: "<:ore_common:703958795591614485>"
    },
    "ore_rare": {
        id: "703960465398824970",
        string: "<:ore_rare:703960465398824970>"
    },
    "ore_superior": {
        id: "703958795608653885",
        string: "<:ore_superior:703958795608653885>"
    },
    "ore_epic": {
        id: "703958795352670239",
        string: "<:ore_epic:703958795352670239>"
    },
    "ore_legendary": {
        id: "703958795516248125",
        string: "<:ore_legendary:703958795516248125>"
    },
    "ore_mythic": {
        id: "703958795574837258",
        string: "<:ore_mythic:703958795574837258>"
    },
    "herb_common": {
        id: "703961463525736529",
        string: "<:herb_common:703961463525736529>"
    },
    "herb_rare": {
        id: "703958795965038662",
        string: "<:herb_rare:703958795965038662>"
    },
    "herb_superior": {
        id: "703961463575937024",
        string: "<:herb_superior:703961463575937024>"
    },
    "herb_epic": {
        id: "703961463890640946",
        string: "<:herb_epic:703961463890640946>"
    },
    "herb_legendary": {
        id: "703961463542251551",
        string: "<:herb_legendary:703961463542251551>"
    },
    "herb_mythic": {
        id: "703958796229148683",
        string: "<:herb_mythic:703958796229148683>"
    },
    "item_type_chest": {
        id: "704264556620283934",
        string: "<:chest:704264556620283934>"
    },
    "item_type_legs": {
        id: "704266130826723398",
        string: "<:legs:704266130826723398>"
    },
    "item_type_helmet": {
        id: "704268453619433523",
        string: "<:helmet:704268453619433523>"
    },
    "item_type_resource": {
        id: "704270263126327316",
        string: "<:resource:704270263126327316>"
    },
    "potion_empty": {
        id: "704278511548104755",
        string: "<:potion_empty:704278511548104755>"
    },
    "item_type_lootbox": {
        id: "704281176189173800",
        string: "<:lootbox:704281176189173800>"
    },
    "saddle": {
        id: "704285522624774235",
        string: "<:saddle:704285522624774235>"
    },
    "reset_time_potion": {
        id: "704291826093522974",
        string: "<:reset_time_potion:704291826093522974>"
    },
    "dungeon_door": {
        id: "704323073364590723",
        string: "<:dungeon_door:704323073364590723>"
    },
    "leveldown": {
        id: "704364488006041740",
        string: "<:leveldown:704364488006041740>"
    },
    "nochange": {
        id: "704363335948304394",
        string: "<:nochange:704363335948304394>"
    },
    "user": {
        id: "403148210295537664",
        string: "<:user:403148210295537664>"
    },
    "gold_coins": {
        id: "704672468190887967",
        string: "<:gold_coins:704672468190887967>"
    },
    "polar_bear": {
        id: "706186485338079263",
        string: "<:polar_bear:706186485338079263>"
    },
    "shield": {
        id: "403574099143819276",
        string: "<:shieldd:403574099143819276>"
    },
    "tild": {
        id: "706481565613686857",
        string: "<:tild:706481565613686857>"
    },
    "plussign": {
        id: "755419306124247091",
        string: "<:plussign:755419306124247091>"
    },
    "minussign": {
        id: "755419306254139392",
        string: "<:minussign:755419306254139392>"
    },
    "leather": {
        id: "755771984826335273",
        string: "<:leather:755771984826335273>"
    },
    "wand": {
        id: "755773260850790471",
        string: "<:wand:755773260850790471>"
    },
    "staff": {
        id: "755780336688037899",
        string: "<:staff:755780336688037899>"
    },
    "elements": {
        id: "767364758097625088",
        string: "<:elements:767364758097625088>"
    },
    "rebirth": {
        id: "802866949608308766",
        string: "<:rebirth:802866949608308766>"
    },
    "level": {
        id: "802937906691309608",
        string: "<:level:802937906691309608>"
    },
    "rebirth_down": {
        id: "808676880236019723",
        string: "<:rebirth_down:808676880236019723>"
    },
    "rebirth_up": {
        id: "804386345657040918",
        string: "<:rebirth_up:804386345657040918>"
    }
};

Emojis.emojisDev = {

};

Emojis.general = {
    "one": "1⃣",
    "two": "2⃣",
    "three": "3⃣",
    "four": "4⃣",
    "five": "5⃣",
    "six": "6⃣",
    "seven": "7⃣",
    "eight": "8⃣",
    "nine": "9⃣",
    "red_circle": "🔴",
    "blue_circle": "🔵",
    "money_bag": "💰",
    "star": "⭐",
    "eight_pointed_black_star": "✴",
    "backpack": "🎒",
    "shield": "🛡",
    "id": "🆔",
    "red_heart": "❤️",
    "black_heart": "🖤",
    "right_arrow": "▶",
    "left_arrow": "◀",
    "critical": "💢",
    "hourglass_not_done": "⏳",
    "scroll": "📜",
    "q_mark": "❓",
    "g_vmark": "✅",
    "g_xmark": "❌",
    "stun": "🌀",
    "hammer": "🔨",
    "waving_hand": "👋",
    "briefcase": "💼",
    "baggage_claim": "🛄",
    "crossed_swords": "⚔️",
    "cloud": "☁️",
    "tornado": "🌪️",
    "sun": "☀️",
    "rain": "🌧️",
    "snow": "🌨️",
    "fog": "🌫️",
    "fire": "🔥",
    "snowflake": "❄️",
    "rainstorm": "⛈️",
    "thermometer": "🌡️",
    "orange_circle": "🟠",
    "purple_circle": "🟣",
    "white_circle": "⚪",
    "green_circle": "🟢",
    "gemstone": "💎",
    "herb": "🌿",
    "pinetree": "🌲",
    "axe": "🪓",
    "pickaxe": "⛏️",
    "gloves": "🧤",
    "king": "🤴",
    "man_pilot": "👨‍✈️",
    "person": "🧑",
    "loudspeaker": "📢",
    "warning": "⚠️",
    "sunrise_over_the_mountain": "🌄",
    "simple_left_to_right_arrow": "→",
    "stopwatch": "⏱️",
    "horse_face": "🐴",
    "collision": "💥",
    "national_park": "🏞️",
    "castle": "🏰",
    "biceps": "💪🏻",
    "boot": "🥾",
    "books": "📚",
    "eye": "👁️",
    "sparkles": "✨",
    "high_voltage": "⚡",
    "game_die": "🎲",
    "light_bulb": "💡",
    "mage": "🧙",
    "clipboard": "📋",
    "seedling": "🌱",
    "balance_scale": "⚖️",
    "trophy": "🏆",
    "camel": "🐪",
    "salamander": "🦎",
    "skull_and_bones": "☠️",
    "vmark": "✅",
    "xmark": "❌",
    "water_droplet": "💧",
    "person_running": "🏃",
    "syringe": "💉",
    "battery": "🔋",
    "target": "🎯",
    "deciduous_tree": "🌳",
    "dashing_away": "💨",
    "vampire": "🧛",
    "ogre": "👹",
    "thread": "🧵",
    "bow_and_arrow": "🏹",
    "dagger": "🗡️",
    "link": "🔗",
    "chains": "⛓️",
    "open_book": "📖",
    "yellow_book": "📒",
    "raised_hand": "✋",
    "bar_chart": "📊",
    "drop_of_blood": "🩸",
    "water_wave": "🌊",
    "blue_heart": "💙",
    "sweat_droplets": "💦",
    "snail": "🐌",
    "mans_shoe": "👞",
    "hiking_boot": "🥾",
    "framed_picture": "🖼️",
    "clockwise_vertical_arrows": "🔃",
    "counterclockwise_arrows_button": "🔄",
    "next_track_button": "⏭️",
    "skull": "💀",
    "information": "ℹ️",
    "package": "📦",
    "handshake": "🤝"
};

Emojis.entitiesTypes = {
    "Character": Emojis.emojisProd.user.string,
    "Monster": Emojis.emojisProd.monster.string,
}


Emojis.stats = {
    "strength": Emojis.general.biceps,
    "constitution": Emojis.general.red_heart,
    "dexterity": Emojis.general.waving_hand,
    "will": Emojis.general.high_voltage,
    "charisma": Emojis.general.sparkles,
    "intellect": Emojis.general.books,
    "armor": Emojis.emojisProd.item_type_chest.string,
    "wisdom": Emojis.general.light_bulb,
    "perception": Emojis.general.eye,
    "luck": Emojis.general.game_die,
    "hitRate": Emojis.general.waving_hand,
    "evadeRate": Emojis.general.person_running,
    "criticalRate": Emojis.general.critical,
    "regenHp": Emojis.general.syringe,
    "regenMp": Emojis.general.sweat_droplets,
    "regenEnergy": Emojis.general.high_voltage,
    "skillManaCost": Emojis.general.mage,
    "skillEnergyCost": Emojis.general.battery,
    "criticalEvadeRate": Emojis.general.person_running,
    "magicalEvadeRate": Emojis.general.person_running,
    "threat": Emojis.general.target,
    "physicalResist": Emojis.general.shield,
    "fireResist": Emojis.general.fire,
    "waterResist": Emojis.general.water_wave,
    "earthResist": Emojis.general.deciduous_tree,
    "airResist": Emojis.general.tornado,
    "darkResist": Emojis.general.ogre,
    "lightResist": Emojis.general.sun,
    "initiative": Emojis.general.snail,
};

Emojis.typeItem = {
    "weapon": Emojis.general.crossed_swords,
    "chest": Emojis.getString("item_type_chest"),
    "legs": Emojis.getString("item_type_legs"),
    "head": Emojis.getString("item_type_helmet"),
    "resource": Emojis.getString("item_type_resource"),
    "lootbox": Emojis.getString("item_type_lootbox"),
    "potion": Emojis.getString("potion_empty"),
    "mount": Emojis.getString("saddle"),
};

Emojis.subtypeItem = {
    "ore": Emojis.emojisProd.ore_common.string,
    "wood": Emojis.emojisProd.wood_common.string,
    "plant": Emojis.emojisProd.herb_rare.string,
    "sword": Emojis.emojisProd.sword2.string,
    "whip": Emojis.emojisProd.sword2.string,
    "metal": Emojis.emojisProd.item_type_chest.string,
    "loot_box_equipment": Emojis.emojisProd.item_type_lootbox.string,
    "random_loot_box_equipment": Emojis.emojisProd.item_type_lootbox.string,
    "founder_box": Emojis.emojisProd.item_type_lootbox.string,
    "reset_time_potion": Emojis.emojisProd.reset_time_potion.string,
    "energy_potion": Emojis.emojisProd.reset_time_potion.string,
    "horse": Emojis.general.horse_face,
    "crystal": Emojis.general.gemstone,
    "salamander": Emojis.general.salamander,
    "camel": Emojis.general.camel,
    "polar_bear": Emojis.emojisProd.polar_bear.string,
    "cloth": Emojis.general.thread,
    "leather": Emojis.emojisProd.leather.string,
    "bow": Emojis.general.bow_and_arrow,
    "dagger": Emojis.general.dagger,
    "wand": Emojis.emojisProd.wand.string,
    "staff": Emojis.emojisProd.staff.string
};

Emojis.areaType = {
    "wild": Emojis.general.national_park,
    "city": Emojis.general.castle,
    "dungeon": Emojis.emojisProd.dungeon_door.string
};

Emojis.areaBonus = {
    "xp_fight": Emojis.emojisProd.exp.string,
    "xp_collect": Emojis.emojisProd.exp.string,
    "gold_drop": Emojis.emojisProd.gold_coins.string,
    "item_drop": Emojis.emojisProd.sword.string,
    "collect_drop": Emojis.general.gloves,
    "xp_craft": Emojis.general.hammer
}

Emojis.damageTypes = {
    "hpDamage": Emojis.stats.constitution,
    "manaDamage": Emojis.general.blue_heart,
    "lifeSteal": Emojis.general.drop_of_blood,
    "manaSteal": Emojis.general.water_droplet,
    "healHp": Emojis.stats.regenHp,
    "healMp": Emojis.stats.regenMp,

}

function configureAliases() {
    Emojis.emojisProd.normal = Emojis.emojisProd.monster;
}

configureAliases();

module.exports = Emojis;