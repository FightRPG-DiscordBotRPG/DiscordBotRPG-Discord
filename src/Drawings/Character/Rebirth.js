const Translator = require("../../Translator/Translator");
const Emojis = require("../Emojis");


class Rebirth {



    static rebirthsBonusesTypes = {
        "all": 1,
        "only_char": 2,
        "only_craft": 3
    }

    static getRebirthAvailabilityString(canRebirth, lang) {
        if (canRebirth) {
            return `(${Translator.getString(lang, "character", "rebirth_available")} ${Emojis.general.vmark})`;
        } else {
            return `(${Translator.getString(lang, "character", "rebirth_unavailable")} ${Emojis.general.xmark})`;
        }
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {number} type
     * @param {boolean} showCurrent
     */
    static getRebirthBonuses(data, user, type, showCurrent = true) {

        let content = "";

        if (type === Rebirth.rebirthsBonusesTypes.all || type === Rebirth.rebirthsBonusesTypes.only_char) {

            let modifiers, rebirthLevel;

            if (showCurrent || data.nextRebirthsLevelsModifiers == null) {
                modifiers = data.currentRebirthsLevelsModifiers;
                rebirthLevel = data.rebirthLevel;
            } else {
                modifiers = data.nextRebirthsLevelsModifiers;
                rebirthLevel = data.rebirthLevel + 1;
            }


            content += Emojis.emojisProd.treasure.string + " " + Translator.getString(user.lang, "character", "rebirht_items_loot", [rebirthLevel]) + "\n";
            content += Emojis.emojisProd.sword2.string + " " + Translator.getString(user.lang, "character", "rebirth_items_stats", [rebirthLevel, modifiers.percentageBonusToItemsStats]) + "\n";
            content += Emojis.emojisProd.monster.string + " " + Translator.getString(user.lang, "character", "rebirth_monsters_stats", [rebirthLevel, modifiers.percentageBonusToMonstersStats]) + "\n";
            content += Emojis.general.clipboard + " " + Translator.getString(user.lang, "character", "rebirth_stats_points_more", [modifiers.nbrOfStatsPointsPerLevel]) + "\n";
            content += Emojis.general.open_book + " " + Translator.getString(user.lang, "character", "rebirth_talents_points_more", [modifiers.nbrOfTalentPointsBonus]) + "\n";
        }

        if (type === Rebirth.rebirthsBonusesTypes.all || type === Rebirth.rebirthsBonusesTypes.only_craft) {

            let rebirthLevel;

            if (showCurrent || data.craft.nextRebirthsLevelsModifiers == null) {
                rebirthLevel = data.craft.rebirthLevel;
            } else {
                rebirthLevel = data.craft.rebirthLevel + 1;
            }

            content += Emojis.general.hammer + " " + Translator.getString(user.lang, "character", "rebirht_items_craft", [rebirthLevel]) + "\n";
        }

        return content;
    }

    /**
     * 
     * @param {number} currentRebirthLevel
     * @param {number} maxRebirthLevel
     * @param {number} currentLevel
     * @param {number} maxLevel
     * @param {any[]} requiredItems
     * @param {User} user
     */
    static getRebirthPossible(currentRebirthLevel, maxRebirthLevel, currentLevel, maxLevel, requiredItems, user) {
        if (currentRebirthLevel == maxRebirthLevel) {
            return { canRebirth: false, reason: Translator.getString(user.lang, "errors", "rebirth_cant_rebirth_max_level") }
        }

        if (currentLevel < maxLevel) {
            return { canRebirth: false, reason: Translator.getString(user.lang, "errors", "rebirth_not_max_level") }
        }

        for (let item of requiredItems) {
            if (item.missing > 0) {
                return { canRebirth: false, reason: Translator.getString(user.lang, "errors", "rebirth_dont_have_required_items") }
            }
        }

        return { canRebirth: true, reason: "" };

    }

}

module.exports = Rebirth;