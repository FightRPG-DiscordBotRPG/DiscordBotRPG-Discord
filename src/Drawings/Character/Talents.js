const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../../Drawings/Emojis");
const TextDrawings = require("../TextDrawings");
const User = require("../../Users/User");
const Canvas = require('canvas');

class Talents {

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let lang = data.lang;

        let reachableNodes = [];


        for (let item of data.talents) {
            for (let i in item.linkedNodesIds) {
                let link = item.linkedNodesIds[i];
                if (!reachableNodes.includes(link) && !data.talents.find(e => e.id == link)) {
                    reachableNodes.push(item.linkedNodes[i]);
                }
            }
        }

        // Used when empty (mostly)
        for (let link of data.initialTalents) {
            if (!reachableNodes.includes(link) && !data.talents.find(e => e.id == link)) {
                reachableNodes.push(link);
            }
        }

        reachableNodes = [...new Set(reachableNodes)];

        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(lang, "talents", "header_talents") + " | " + Translator.getString(lang, "talents", "x_point" + (data.talentPoints > 1 ? "_plural" : ""), [data.talentPoints]))
            .addField(Translator.getString(lang, "talents", "reachable_talents_ids"), reachableNodes.length > 0 ? Emojis.general.link + " " + reachableNodes.join(", ") : Translator.getString(lang, "general", "none"))
            .addField(Translator.getString(lang, "talents", "unlocked_skills"), data.unlockedSkills.length > 0 ? Emojis.general.open_book + " " + data.unlockedSkills.join(", ") : Translator.getString(lang, "general", "none"));

        if (this.isThereStats(data.stats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.stats, {}, TextDrawings.statCompareTypes.talents, user, lang));

        }

        if (this.isThereStats(data.secondaryStats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(data.secondaryStats, {}, TextDrawings.statCompareTypes.talents, user, lang));
        }


        return embed;
    }


    isThereStats(stats) {
        for (let statValue of Object.values(stats)) {
            if (statValue != 0) {
                return true;
            }
        }
        return false;
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    */
    showOne(data, user) {
        let lang = data.lang;
        let titleBonus, color;

        if (data.isAquired) {
            titleBonus = Translator.getString(lang, "general", "aquired");
            color = [128, 128, 128];
        } else if (data.unlockable) {
            titleBonus = Translator.getString(lang, "general", "unlockable");
            color = [0, 255, 0];
        } else {
            titleBonus = Translator.getString(lang, "general", "locked");
            color = [255, 0, 0];
        }

        this.isThereStats(data.node.secondaryStats);

        let embed = new Discord.MessageEmbed() 
            .setColor(color)
            .setAuthor(`${data.node.id} - ${data.node.visuals.name} (${titleBonus})`, data.node.visuals.icon)
            .addField(Translator.getString(lang, "talents", "cost"), Emojis.general.target + " " + Translator.getString(lang, "talents", "x_point" + (data.node.realCost > 1 ? "_plural" : ""), [data.node.realCost]))
            .addField(Translator.getString(lang, "talents", "reachable_talents_ids"), data.node.linkedNodes.length > 0 ? Emojis.general.link + " " + data.node.linkedNodes.join(", ") : Translator.getString(lang, "general", "none"))
            .addField(Translator.getString(lang, "talents", "unlockable_skills"), data.node.skillsUnlockedNames.length > 0 ? Emojis.general.open_book + " " + data.node.skillsUnlockedNames.join(", ") : Translator.getString(lang, "general", "none"));


        if (this.isThereStats(data.node.stats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.node.stats, {}, TextDrawings.statCompareTypes.talents, user, lang));

        }

        if (this.isThereStats(data.node.secondaryStats)) {
            embed = embed.addField(Translator.getString(lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(data.node.secondaryStats, {}, TextDrawings.statCompareTypes.talents, user, lang));
        }

        return embed;
    }

    async allToImage(data, message) {

        console.log(data);

        let talentsByIds = {};

        const nodesCanvas = Canvas.createCanvas(1024, 1024);

        const ctx = nodesCanvas.getContext("2d");

        ctx.beginPath();
        ctx.rect(0, 0, 1024, 1024);
        ctx.fillStyle = "gray";
        ctx.fill();

        let size = 50;

        for (let talent of data.talents) {
            let talentIcon = await Canvas.loadImage(talent.visuals.icon);
            ctx.drawImage(talentIcon, (talent.x * size) + 500, (-talent.y * size) + 500, size, size);
            console.log(talent.linkedNodes);
            talentsByIds[talent.id] = talent;
        }
        let decal = 500 + size / 2;
        for (let talent of data.talents) {
            for (let link of talent.linkedNodesIds) {
                if (talentsByIds[link]) {
                    ctx.moveTo((talent.x * size) + decal, (-talent.y * size) + decal);
                    ctx.lineTo((talentsByIds[link].x * size) + decal, (-talentsByIds[link].y * size) + decal);
                    ctx.stroke();
                }
            }
        }

        const attachment = new Discord.MessageAttachment(nodesCanvas.toBuffer(), 'talents.png');

        message.channel.send("hey !", attachment);
    }

}

module.exports = new Talents();