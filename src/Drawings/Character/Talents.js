const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../../Drawings/Emojis");
const TextDrawings = require("../TextDrawings");
const User = require("../../Users/User");
const Canvas = require('canvas');
const Utils = require("../../Utils");
const CharacterAppearance = require("./CharacterAppearance");
const conf = require("../../../conf/conf");
const hash = require('object-hash');
const { fontsize } = require("../../../conf/version");

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
                reachableNodes.push(link.id + " (" + link.visuals.name + ")");
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

        return this.addCurrentImageToEmbed(embed, data);
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

    /**
     * 
     * @param {Discord.MessageEmbed} embed
     * @param {any} data
     */
    async addCurrentImageToEmbed(embed, data) {

        const hashFile = hash(
            data
        );
        let cachedLink = CharacterAppearance.uploadedImagesCacheLinks[hashFile];

        // Test Cache
        if (cachedLink && hashFile) {
            return embed.setImage(cachedLink.url);
        }

        const filename = hashFile + ".png";

        // Test if cdn cache is configured
        // If you use this and you try to edit and embed, the image is not updated /!\
        if (!conf.cdnAppearanceCache || !hashFile || conf.env === "dev") {
            return { embeds: [embed.setImage("attachment://talents.png")], files: [new Discord.MessageAttachment((await this.allToImage(data)).createPNGStream(), "talents.png")] };
        }

        // Test cache cdn and upload if needed
        const reqData = (await CharacterAppearance.defaultAxios.get("get_cache.php?filename=" + filename)).reqData;
        if (!reqData || !reqData.cached) {
            await CharacterAppearance.setToCacheOnline(filename, (await this.allToImage(data)).createPNGStream());
        }

        return embed
            .setImage(conf.cdnAppearanceCache + "images/" + filename);
    }

    async allToImage(data) {
        let talentsByIds = {};



        let talentSize = 50;
        let spacing = 75;

        let xMaximum = 0;
        let xMinimum = 0;
        let yMaximum = 0;
        let yMinimum = 0;

        console.log(data);

        if (data.talents.length == 0) {
            data.talents = data.initialTalents.map(e => { return { ...e, asLocked: true } });
        }

        for (let talent of data.talents) {
            xMaximum = Math.max(xMaximum, talent.x);
            yMaximum = Math.max(yMaximum, talent.y);

            xMinimum = Math.min(xMinimum, talent.x);
            yMinimum = Math.min(yMinimum, talent.y);

            for (let linkedTalent of Object.values(talent.linkedNodesItems)) {
                xMaximum = Math.max(xMaximum, linkedTalent.x);
                yMaximum = Math.max(yMaximum, linkedTalent.y);

                xMinimum = Math.min(xMinimum, linkedTalent.x);
                yMinimum = Math.min(yMinimum, linkedTalent.y);

            }
        }

        const diffX = xMaximum - xMinimum;
        const diffY = yMaximum - yMinimum;

        let width = (diffX * (spacing + talentSize  + 20)) || (spacing + talentSize );
        let heigth = (diffY * (spacing + talentSize + 20)) || (spacing + talentSize);

        width = Math.max(width, heigth);
        heigth = width;

        const nodesCanvas = Canvas.createCanvas(width, heigth);
        const ctxNodes = nodesCanvas.getContext("2d");
        ctxNodes.translate(width / 2, heigth / 2);
        ctxNodes.beginPath();

        // Draws unlocked talents
        for (let talent of data.talents) {
            await this.drawTalent(ctxNodes, talent, talentSize, spacing, data.talentPoints, talent.asLocked);
            talentsByIds[talent.id] = talent;
        }

        // Draws locked talents
        for (let talent of data.talents) {
            for (let linkedTalent of Object.values(talent.linkedNodesItems)) {
                if (!talentsByIds[linkedTalent.id]) {
                    await this.drawTalent(ctxNodes, linkedTalent, talentSize, spacing, talent.asLocked ? 0 : data.talentPoints, true);
                    talentsByIds[linkedTalent.id] = linkedTalent;
                }
            }
        }

        const allCanvas = Canvas.createCanvas(width, heigth);
        const ctxLinks = allCanvas.getContext("2d");

        let decalX = 0;
        let decalY =  spacing + talentSize;

        ctxLinks.beginPath();
        ctxLinks.rect(0, 0, width, heigth);
        ctxLinks.fillStyle = "#101010";
        ctxLinks.lineWidth = 3;
        ctxLinks.fill();

        ctxLinks.translate(width / 2, heigth / 2);

        for (let talent of data.talents) {
            for (let link of talent.linkedNodesIds) {
                if (talentsByIds[link]) {
                    ctxLinks.strokeStyle = "#808080";
                    ctxLinks.moveTo((talent.x * spacing) + decalX, (-talent.y * spacing) + decalY);
                    ctxLinks.lineTo((talentsByIds[link].x * spacing) + decalX, (-talentsByIds[link].y * spacing) + decalY);
                    ctxLinks.stroke();
                }
            }
        }


        ctxLinks.drawImage(nodesCanvas, -(width / 2), -(heigth / 2));

        return allCanvas;


    }

    /**
     * 
     * @param {Canvas.CanvasRenderingContext2D} ctx
     * @param {any} talent
     * @param {number} size
     */
    async drawTalent(ctx, talent, size, spacing, pointsLeft, isLocked = false) {
        /**
         * @type {Canvas}
         **/
        let talentIcon;
        if (isLocked) {
            talentIcon = Utils.canvasRoundImage(Utils.canvasTintImage(await CharacterAppearance.getImage(talent.visuals.icon), "#000000", 0.7), { strokeSize: 10, strokeStyle: pointsLeft >= talent.realCost ? "Yellow" : "Red" });
        } else {
            talentIcon = Utils.canvasRoundImage(await CharacterAppearance.getImage(talent.visuals.icon), { strokeSize: 10, strokeStyle: "#808080" });
        }

        const x = (talent.x * spacing) - size / 2;
        const y = (-talent.y * spacing)  + size * 2;

        ctx.drawImage(talentIcon, x, y, size, size);

        // Draw Id
        ctx.font = "29px Arial";
        ctx.strokeStyle = "Black";
        ctx.fillStyle = 'White';
        ctx.textAlign = "center";

        const decal = 0;
        const decalY = decal

        ctx.strokeText(talent.id, x, y);
        ctx.fillText(talent.id, x, y);

        if (isLocked) {
            // Draw Cost
            ctx.font = "24px Arial";
            ctx.strokeStyle = "Black";
            ctx.fillStyle = "Yellow";

            ctx.fillText(talent.realCost, x + size / 2, y + size / 2 + 10);
        }



    }

}

module.exports = new Talents();