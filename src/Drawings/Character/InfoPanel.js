const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Utils = require("../../Utils");
const User = require("../../Users/User");
const TextDrawings = require("../TextDrawings");
const Rebirth = require("./Rebirth");
const Canvas = require('canvas');

class InfoPanel {
    constructor() {
        this.displayAttributes = true;
        this.displayResources = true;
        this.displayOther = true;
        this.displayAdvancement = true;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let authorTitle = data.username + "  " + Emojis.general.collision + " " + Translator.getString(data.lang, "inventory_equipment", "power") + ": " + Translator.getFormater(data.lang).format(data.power);
        let embed = new Discord.MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(authorTitle, user.avatar);

        if (this.displayAttributes) {
            embed = this.embedInfoPanelAddAttributes(data, user, embed);
        }

        if (this.displayAdvancement) {
            embed = this.embedInfoPanelAddCharacterAdvancement(data, user, embed);
        }

        if (this.displayResources) {
            embed = this.embedInfoPanelAddCharacterResources(data, user, embed);
        }

        if (this.displayOther) {
            embed = this.embedInfoPanelAddOther(data, user, embed)
        }
        //.addField(Emojis.getString("shield") + " " + Translator.getString(data.lang, "character", "damage_reduction"), Translator.getFormater(data.lang).format(Math.round((data.stats.armor + data.statsEquipment.armor) / ((8 * (Math.pow(data.level, 2))) / 7 + 5) * .5 * 10000) / 100) + "%", true)
        //.addField(Emojis.getString("critical") + " " + Translator.getString(data.lang, "character", "critical_chance"), Translator.getFormater(data.lang).format(criticalChance) + "%", true)
        //.addField(Emojis.getString("stun") + " " + Translator.getString(data.lang, "character", "maximum_stun_chance"), Translator.getFormater(data.lang).format(maximumStunChance) + "%", true)
        return embed;
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddOther(data, user, embed) {
        return embed.addField(Emojis.general.q_mark + " " + Translator.getString(data.lang, "help_panel", "other_title"), GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.money_bag + " " + Translator.getString(data.lang, "character", "money"), Translator.getFormater(data.lang).format(data.money) + " G", true)
            .addField(Emojis.emojisProd.honor.string + " " + Translator.getString(data.lang, "character", "honor"), Translator.getFormater(data.lang).format(data.honor), true)
            .addField(Emojis.general.trophy + " " + Translator.getString(data.lang, "character", "achievement_count", [data.achievements.totalAchievementsEarned, data.achievements.totalAchievements]), Translator.getString(data.lang, "general", "points" + (data.achievements.totalPoints > 1 ? "_plur" : ""), [data.achievements.totalPoints]), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddCharacterResources(data, user, embed) {
        return embed.addField(Emojis.general.bar_chart + " " + Translator.getString(data.lang, "character", "character_resources"), GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.red_heart + " " + Translator.getString(data.lang, "character", "health_points"), TextDrawings.formatHealth(data.currentHp, data.maxHp, data.lang, 8, false, false), true)
            .addField(Emojis.general.water_droplet + " " + Translator.getString(data.lang, "character", "mana_points"), TextDrawings.formatMana(data.currentMp, data.maxMp, data.lang, 8, false, false), true)
            .addField(Emojis.general.high_voltage + " " + Translator.getString(data.lang, "character", "energy_points"), TextDrawings.formatEnergy(data.currentEnergy, data.maxEnergy, data.lang, 8, false, false), true)
    }

    /**
     * 
     * @param {any} data
     * @param {User} user
     * @param {Discord.MessageEmbed} embed
     */
    embedInfoPanelAddAttributes(data, user, embed) {
        let statPointsPlur = data.statPoints > 1 ? "_plur" : "";
        let statsTitle = (data.statPoints > 0 ? Emojis.emojisProd.plussign.string : Emojis.emojisProd.user.string) + " " + Translator.getString(data.lang, "character", "info_attributes_title" + statPointsPlur, [data.statPoints, data.resetValue]);

        return embed.addField(statsTitle, GenericMultipleEmbedList.getSeparator())
            .addField(Emojis.general.clipboard + " " + Translator.getString(data.lang, "inventory_equipment", "attributes"), TextDrawings.statsToString(data.stats, Utils.add(data.talents.stats, data.statsEquipment), TextDrawings.statCompareTypes.character, user, data.lang), true)
            .addField(Emojis.general.clipboard + " " + Translator.getString(data.lang, "inventory_equipment", "secondary_attributes"), TextDrawings.statsToString(data.secondaryStats, Utils.add(data.talents.secondaryStats, data.secondaryStatsEquipment), TextDrawings.statCompareTypes.only_total, user, data.lang), true);
    }

    /**
    *
    * @param {any} data
    * @param {User} user
    * @param {Discord.MessageEmbed} embed
    */
    embedInfoPanelAddCharacterAdvancement(data, user, embed) {


        // Player level title
        let playerLevelDisplay = TextDrawings.formatLevelProgressBar(data.actualXp, data.xpNextLevel, data.level, data.maxLevel, data.lang);
        let titleXPFight = Emojis.emojisProd.level.string + " " + Translator.getString(data.lang, "character", "level") + ": " + data.level + "\n" + Emojis.emojisProd.rebirth.string + " " + Translator.getString(data.lang, "inventory_equipment", "rebirth_level") + ": " + data.rebirthLevel;

        if (Rebirth.getRebirthPossible(data.rebirthLevel, data.maxRebirthLevel, data.level, data.maxLevel, data.nextRebirthsLevelsModifiers?.requiredItems, user).canRebirth) {
            playerLevelDisplay.title += " " + Rebirth.getRebirthAvailabilityString(true, data.lang);
        }

        // Craft level title
        let playerCraftLevelDisplay = TextDrawings.formatLevelProgressBar(data.craft.xp, data.craft.xpNextLevel, data.craft.level, data.maxLevel, data.lang);
        let titleXPCraft = Emojis.general.hammer + " " + Translator.getString(data.lang, "character", "craft_level") + ": " + data.craft.level + "\n" + Emojis.emojisProd.rebirth.string + " " + Translator.getString(data.lang, "inventory_equipment", "rebirth_level") + ": " + data.craft.rebirthLevel;


        if (Rebirth.getRebirthPossible(data.craft.rebirthLevel, data.craft.maxRebirthLevel, data.craft.level, data.craft.maxLevel, data.craft?.nextRebirthsLevelsModifiers.requiredItems, user).canRebirth) {
            playerCraftLevelDisplay.title += " " + Rebirth.getRebirthAvailabilityString(true, data.lang);
        }




        embed = embed.addField(Emojis.emojisProd.exp.string + " " + Translator.getString(data.lang, "character", "character_advancement"), GenericMultipleEmbedList.getSeparator())
            .addField(titleXPFight, playerLevelDisplay.title + "\n" + playerLevelDisplay.bar, true)
            .addField(titleXPCraft, playerCraftLevelDisplay.title + "\n" + playerCraftLevelDisplay.bar, true);

        return embed;
    }

    disableAll() {
        this.displayAttributes = false;
        this.displayOther = false;
        this.displayResources = false;
        this.displayAdvancement = false;
    }

    /**
     * 
     * @param {Discord.Message} message
     */
    async displayCharacter(message, args) {

        const imageHeight = 1300;
        const canvasCharacter = Canvas.createCanvas(500, imageHeight);

        const ctx = canvasCharacter.getContext("2d");

        //ctx.beginPath();
        //ctx.rect(0, 0, 1300, 1300);
        //ctx.fillStyle = "gray";
        //ctx.fill();
        let debugPossibleSkinColor = ["#CE8E71", "#DFA98F", "#E9C8BC", "#D69D70", "#B37344", "#88583B", "#4A332D"];

        console.time("Load Images");

        let bodyColor = Utils.getRandomItemsInArray(debugPossibleSkinColor, 1)[0];

        //let background = await Canvas.loadImage("https://img00.deviantart.net/b5ba/i/2016/117/d/2/cracked_landsape_by_thechrispman-da0ehq0.png");
            
        let body = await Canvas.loadImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_body.png");

        let leftArm = await Canvas.loadImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_left_arm_full.png");
        let rightArm = await Canvas.loadImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_right_arm_full.png");

        let ear = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Ear\\0${Utils.randRangeInteger(0, 2)}.png`);

        let eyes = await Canvas.loadImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\00\\front.png");
        let eyesBack = await Canvas.loadImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\00\\back.png");

        let eyebrow = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyebrow\\${Utils.randRangeInteger(0, 14).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        let nose = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Nose\\${Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        let basicPants = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Pants\\male_01.png`);


        //let hairColor = Utils.getRandomItemsInArray(["#aa8866", "#debe99", "#241c11", "#41f1a00", "#9a3300"], 1)[0];
        let hairColor = Utils.getRandomHexColor();
        console.log(hairColor);
        //let debugHair = args[0] != null ? args : Utils.randRangeInteger(0, 16);
        let debugHair = Utils.randRangeInteger(0, 25);


        let hair = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        // Back Hair
        let backHair = null;
        if ([4, 5, 11, 13, 14, 15, 16, 17, 19, 20].includes(parseInt(debugHair))) {
            backHair = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`);
        }


        // Mouth
        let debugMouth = args[0] != null ? args[0] : Utils.randRangeInteger(0, 13);

        let teeths = null;
        if ([3, 6, 7].includes(parseInt(debugMouth))) {
            teeths = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`);
        }


        let lips = await Canvas.loadImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        console.timeEnd("Load Images");

        console.time("Draw Images");

        let bodyX = 0, bodyY = imageHeight - body.height;
        let xDecal = bodyX + body.width / 2;


        // Back Hair
        if (backHair) {
            ctx.drawImage(Utils.canvasTintImage(backHair, hairColor), bodyX - 36, bodyY -242, backHair.width, backHair.height);
        }

        // Right Arm
        ctx.drawImage(Utils.canvasTintImage(rightArm, bodyColor), bodyX, bodyY, rightArm.width, rightArm.height);

        // Body
        ctx.drawImage(Utils.canvasTintImage(body, bodyColor), bodyX, bodyY, body.width, body.height);


        // Pants
        ctx.drawImage(Utils.canvasTintImage(basicPants, Utils.getRandomHexColor()), xDecal - 135, bodyY + 525, basicPants.width, basicPants.height)

        // Left Arm
        ctx.drawImage(Utils.canvasTintImage(leftArm, bodyColor), bodyX, bodyY, leftArm.width, leftArm.height);

        // Eyes
        ctx.drawImage(Utils.canvasTintImage(eyebrow, hairColor), xDecal - 35, bodyY + 62, eyebrow.width, eyebrow.height);
        ctx.drawImage(eyesBack, xDecal - 9, bodyY + 92, eyes.width, eyes.height);
        ctx.drawImage(Utils.canvasTintImage(eyes, "#FF0000", 0.2), xDecal - 7, bodyY + 94, eyes.width, eyes.height);

        // Hair
        ctx.drawImage(Utils.canvasTintImage(hair, hairColor), bodyX - 36, bodyY -242, hair.width, hair.height);

        // Ear / Nose
        ctx.drawImage(Utils.canvasTintImage(ear, bodyColor), xDecal - 188, bodyY  - 20, ear.width, ear.height);
        ctx.drawImage(Utils.canvasTintImage(nose, bodyColor), xDecal - 42, bodyY + 67, nose.width, nose.height);

        // Mounth
        if (teeths) {
            ctx.drawImage(teeths, xDecal - 30, bodyY + 136, teeths.width, teeths.height);
        }
        ctx.drawImage(Utils.canvasTintImage(lips, bodyColor), xDecal - 30, bodyY + 136, lips.width, lips.height);


        console.timeEnd("Draw Images");

        console.time("Send To Discord");
        
        const attachment = new Discord.MessageAttachment(canvasCharacter.createPNGStream(), 'talents.png');
        message.channel.send("hey !", attachment);
        console.timeEnd("Send To Discord");


        return "";
    }
}

module.exports = InfoPanel;