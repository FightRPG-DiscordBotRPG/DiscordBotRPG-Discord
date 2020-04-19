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
        id: "691582742214869022",
        string:"<:bar_white:691582742214869022>"
    },
    "bar_white_empty": {
        id: "691582742261137418",
        string: "<:bar_white_empty:691582742261137418>"
    },
    "bar_red": {
        id: "691578753931018240",
        string: "<:bar_red:691578753931018240>"
    },
    "bar_red_empty": {
        id: "691578753884749934",
        string: "<:bar_red_empty:691578753884749934>"
    },
    "bar_blue": {
        id: "691582741912748063",
        string: "<:bar_blue:691582741912748063>"
    },
    "bar_blue_empty": {
        id: "691582742206611546",
        string: "<:bar_blue_empty:691582742206611546>"
    },
    "bar_yellow": {
        id: "691581864825061397",
        string: "<:bar_yellow:691581864825061397>"
    },
    "bar_yellow_empty": {
        id: "691581865005547530",
        string: "<:bar_yellow_empty:691581865005547530>"
    },
    "bar_green": {
        id: "691587318317842473",
        string: "<:bar_green:691587318317842473>"
    },
    "bar_green_empty": {
        id: "691587318339076136",
        string: "<:bar_green_empty:691587318339076136>"
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
    "crossed_swords": "⚔️"
}

module.exports = Emojis;