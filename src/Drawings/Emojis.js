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
        let emojis = {
            "sunny": "sun",
            "cloudy": "cloud",
            "foggy": "fog",
            "rainy": "rain",
            "rainstorm": "rainstorm",
            "snowy": "snow",
            "firestorm": "fire",
            "sandstorm": "tornado",
            "snowstorm": "snowflake"
        }

        if (emojis[weatherShorthand]) {
            return Emojis.getString(emojis[weatherShorthand]);
        } else {
            return Emojis.getString("thermometer");
        }
    }

    static getItemTypeEmoji(typeShorthand) {
        let emojis = {
            "weapon": this.general.crossed_swords,
            "chest": this.getString("item_type_chest"),
            "legs": this.getString("item_type_legs"),
            "head": this.getString("item_type_helmet"),
            "resource": this.getString("item_type_resource"),
            "lootbox": this.getString("item_type_lootbox"),
            "potion": this.getString("potion_empty"),            
            "mount": this.getString("saddle"),            
        }

        return emojis[typeShorthand] ? emojis[typeShorthand] : Emojis.general.q_mark;
    }

    static getRarityEmoji(rarityShorthand) {
        return Emojis.getString("rarity_" + rarityShorthand);
    }

    static getItemSubTypeEmoji(subtypeShorthand) {
        let emojis = {
            "ore": this.emojisProd.ore_common.string,
            "wood": this.emojisProd.wood_common.string,
            "plant": this.emojisProd.herb_rare.string,
            "sword": this.emojisProd.sword2.string,
            "whip": this.emojisProd.sword2.string,
            "armor": this.emojisProd.item_type_chest.string,
            "loot_box_equipment": this.emojisProd.item_type_lootbox.string,
            "random_loot_box_equipment": this.emojisProd.item_type_lootbox.string,
            "founder_box": this.emojisProd.item_type_lootbox.string,
            "reset_time_potion": this.emojisProd.reset_time_potion.string,
            "energy_potion": this.emojisProd.reset_time_potion.string,
            "horse": this.general.horse_face,
            "crystal": this.general.gemstone,
        }

        return emojis[subtypeShorthand] ? emojis[subtypeShorthand] : Emojis.general.q_mark;
    }

    static getAreaTypeEmoji(typeShorthand) {
        let emojis = {
            "wild": Emojis.general.national_park,
            "city": Emojis.general.castle,
            "dungeon": Emojis.emojisProd.dungeon_door.string
        }

        return emojis[typeShorthand] ? emojis[typeShorthand] : Emojis.general.q_mark;
    }

}

Emojis.emojisProd = {
    "vmark": {
        id: "314349398811475968",
        string: "<:check:314349398811475968>"
    },
    "xmark": {
        id: "314349398824058880",
        string: "<:xmark:314349398824058880>"
    },
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
    }
};

Emojis.emojisDev = {
    "vmark": {
        id: "403148210295537664",
        string: ":vmark:"
    },
    "xmark": {
        id: "403149357387350016",
        string: ":xmark:"
    }
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
}


function configureAliases() {
    Emojis.emojisProd.normal = Emojis.emojisProd.monster;
}

configureAliases();

module.exports = Emojis;