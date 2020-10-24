const User = require("../../Users/User");
const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");

class Skill {

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let lang = data.lang;
        let titleBonus, color;
        
        if (data.skill.isEquiped) {
            titleBonus = Translator.getString(lang, "general", "currently_equipped");
            color = [128, 128, 128];
        } else if (data.skill.canEquip) {
            titleBonus = Translator.getString(lang, "general", "equipable");
            color = [0, 255, 0];
        } else {
            titleBonus = Translator.getString(lang, "general", "locked");
            color = [255, 0, 0];
        }

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${data.skill.id} - ${data.skill.name} (${titleBonus})`)
            .setDescription(data.skill.desc)
            .addField(Emojis.general.target + " " +Translator.getString(user.lang, "skills", "number_of_targets"), data.skill.numberOfTargets, true)
            .addField(Emojis.emojisProd.win.string + " " +Translator.getString(user.lang, "skills", "success_rate"), data.skill.successRate + "%", true)
            .addField(Emojis.general.hourglass_not_done + " " +Translator.getString(user.lang, "skills", "required_preparation_points"), data.skill.timeToCast, true);

        embed = this.getFieldsCosts(data, user, embed);
        embed = this.getFieldsDamage(data, user, embed);
        embed = this.getFieldsEffects(data, user, embed);

        return embed;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    getFieldsDamage(data, user, embed) {
        if (data.skill.damage.formula === null) {
            return embed;
        } else {
            return embed
                .addField(Translator.getString(user.lang, "skills", "damage_information"), GenericMultipleEmbedList.getSeparator())
                .addField(Emojis.general.bar_chart + " " + Translator.getString(user.lang, "skills", "formula"), data.skill.repeat > 1 ? `(${data.skill.damage.formula}) * ${data.skill.repeat}` : data.skill.damage.formula)
                .addField(Emojis.emojisProd.nochange.string + " " + Translator.getString(user.lang, "skills", "variance"), data.skill.damage.variance + "%", true)
                .addField(Emojis.general.crossed_swords + " " + Translator.getString(user.lang, "skills", "damage_type"), Emojis.damageTypes[data.skill.damage.damageTypeShorthand] + " " + Translator.getString(user.lang, "skills", data.skill.damage.damageTypeShorthand), true)
                .addField(Emojis.emojisProd.elements.string + " " + Translator.getString(user.lang, "elements", "type"), Emojis.stats[data.skill.damage.elementTypeShorthand + "Resist"] + " " + Translator.getString(user.lang, "elements", data.skill.damage.elementTypeShorthand), true)
                .addField(Emojis.general.critical + " " + Translator.getString(user.lang, "fight_general", "critical_hit"), Translator.getString(user.lang, "general", data.skill.damage.criticalHit == true ? "yes" : "no"), true);
        }
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    * @param {Discord.MessageEmbed} embed
    */
    getFieldsCosts(data, user, embed) {
        return embed
            .addField(Emojis.stats.skillManaCost + " " + Translator.getString(user.lang, "stats", "skillManaCost"), data.skill.mpCost, true)
            .addField(Emojis.stats.skillEnergyCost + " " + Translator.getString(user.lang, "stats", "skillEnergyCost"), data.skill.energyCost, true);
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    * @param {Discord.MessageEmbed} embed
    */
    getFieldsEffects(data, user, embed) {
        let allEffectsTypes = {};

        for (let effect of data.skill.effects) {
            if (allEffectsTypes[effect.type] == null) {
                allEffectsTypes[effect.type] = [];
            }
            allEffectsTypes[effect.type].push(this.getEffectString(effect, user));
        }

        if (Object.values(allEffectsTypes).length > 0) {
            embed = embed.addField(Translator.getString(user.lang, "effects", "type"), GenericMultipleEmbedList.getSeparator());
        }

        for (let type in allEffectsTypes) {
            embed = embed.addField(Translator.getString(user.lang, "effects", type), allEffectsTypes[type].join(", "), true);
        }
        return embed;
    }

    /**
     * 
     * @param {any} effect
     * @param {User} user
     */
    getEffectString(effect, user) {
        switch (effect.type) {
            case "addState":
                return `${effect.stateAdded} (${Translator.getFormater(user.lang).format(effect.chance * 100)}%)`
            case "removeState":
                return `${effect.stateRemoved} (${Translator.getFormater(user.lang).format(effect.chance * 100)}%)`
            case "hpHeal":
            case "manaHeal": {
                let bothAnd = effect.fixedValue !== 0 && effect.percentageValue !== 0 ? ` ${Translator.getString(user.lang, "geenral", "and")} ` : "";
                let fixedValueStr = effect.fixedValue !== 0 ? `${effect.fixedValue}` : "";
                let percentageValueStr = effect.percentageValue !== 0 ? `${Translator.getFormater(user.lang).format(effect.percentageValue * 100)}%` : "";
                return `${fixedValueStr}${bothAnd}${percentageValueStr})`;
            }
            case "energyHeal":
                return effect.value.toString();
        }

        return "";
        
    }




}

module.exports = new Skill();