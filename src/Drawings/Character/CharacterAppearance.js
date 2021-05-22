const Canvas = require("canvas");
const Utils = require("../../Utils");

class CharacterAppearance {
    /**
     * @type Object<string, Canvas.Image>
     */
    static cache = {};

    constructor() {
        this.reset();
    }

    reset() {
        this.background = null;
        this.bodyColor = null;
        this.body = null;
        this.leftArm = null;
        this.rightArm = null;
        this.ear = null;
        this.eyes = null;
        this.eyesBack = null;
        this.eyebrow = null;
        this.nose = null;
        this.basicPants = null;
        this.hair = null;
        this.backHair = null;
        this.teeths = null;
        this.lips = null;
        this.hairColor = null;
        this.gloves = null;
    }


    async loadAssets() {

        let debugPossibleSkinColor = ["#CE8E71", "#DFA98F", "#E9C8BC", "#D69D70", "#B37344", "#88583B", "#4A332D"];
        this.bodyColor = Utils.getRandomItemsInArray(debugPossibleSkinColor, 1)[0];


        this.background = await CharacterAppearance.getImage("https://img00.deviantart.net/b5ba/i/2016/117/d/2/cracked_landsape_by_thechrispman-da0ehq0.png");
        this.body = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_body.png");
        this.head = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_head_full.png");
        this.leftArm = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_left_arm_full.png");
        this.rightArm = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_right_arm_full.png");
        this.ear = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Ear\\0${Utils.randRangeInteger(0, 2)}.png`);

        let debugEyes = Utils.randRangeInteger(0, 15).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.eyesBack = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_01.png`);
        this.eyes = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_02.png`);



        this.eyebrow = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyebrow\\${Utils.randRangeInteger(0, 14).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);
        this.nose = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Nose\\${Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        let debugGloves = Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.gloves = {
            left: {
                wrist: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_01.png`),
                hand: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_04.png`),
            },
            right: {
                wrist: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_02.png`),
                hand: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_05.png`),
            }
        }

        let debugHelmet = Utils.randRangeInteger(0, 21).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        let doesHelmetHaveBack = ["07", "08", "09"].includes(debugHelmet);

        this.helmet = {
            back: doesHelmetHaveBack ? await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugHelmet}_02.png`) : null,
            front: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugHelmet + (doesHelmetHaveBack ? "_01" : "")}.png`),
        }


        let debugArmor = Utils.randRangeInteger(1, 9).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        this.armor = {
            body: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_body.png`),
            neck: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_neck.png`),
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_lower_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_lower_right.png`),
            upper_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_upper_left.png`),
            upper_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} Male_upper_right.png`),
        }


        this.basicPants = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Pants\\male_01.png`);

        let debugPants = Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });;

        this.pants = {
            hip: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} Male_hip.png`),
            upper_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} Male_upper_right.png`),
            upper_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} Male_upper_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} Male_lower_right.png`),
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} Male_lower_left.png`),
        }


        this.hairColor = Utils.getRandomHexColor();

        let debugHair = Utils.randRangeInteger(0, 0);

        this.hair = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        // Back Hair
        this.backHair = null;
        if ([4, 5, 11, 13, 14, 15, 16, 17, 19, 20].includes(parseInt(debugHair))) {
            this.backHair = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`);
        }

        // Mouth
        let debugMouth = Utils.randRangeInteger(0, 13);

        this.teeths = null;
        if ([3, 6, 7].includes(parseInt(debugMouth))) {
            this.teeths = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`);
        }

        this.lips = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        //let debugBoots = Utils.randRangeInteger(0, 9).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        let debugBoots = "03";


        this.boots = {
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_right.png`),
            foot_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_left.png`),
            foot_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_right.png`),
        }

    }



    /**
     * 
     **/
    async getCharacter() {

        this.reset();
        await this.loadAssets();

        const imageHeight = Math.max(this.background.height, 1300);
        const canvasCharacter = Canvas.createCanvas(Math.max(this.background.width, 500), imageHeight);

        const ctx = canvasCharacter.getContext("2d");
        ctx.drawImage(this.background, 0, 0, canvasCharacter.width, canvasCharacter.height);

        console.time("Draw Images");

        let bodyX = 250, bodyY = imageHeight - this.body.height;
        let xDecal = bodyX + this.body.width / 2;


        // Back Hair
        if (this.backHair) {
            ctx.drawImage(Utils.canvasTintImage(this.backHair, this.hairColor), bodyX - 36, bodyY - 242, this.backHair.width, this.backHair.height);
        }

        // Helmet Back
        if (this.helmet.back) {
            ctx.drawImage(this.helmet.back, bodyX - 30, bodyY - 158, this.helmet.back.width, this.helmet.back.height);
        }

        // Right Arm
        ctx.drawImage(Utils.canvasTintImage(this.rightArm, this.bodyColor), bodyX, bodyY, this.rightArm.width, this.rightArm.height);

        ctx.drawImage(Utils.canvasRotateImage(this.armor.upper_right, 1), bodyX + 210, bodyY + 205);
        ctx.drawImage(Utils.canvasRotateImage(this.armor.lower_right, -12, true), bodyX + 250, bodyY + 375);


        // TODO Fix hand pas assez de rotation
        ctx.drawImage(Utils.canvasRotateImage(this.gloves.right.wrist, -10), bodyX + 237, bodyY + 379, this.gloves.right.wrist.width, this.gloves.right.wrist.height);
        ctx.drawImage(Utils.canvasRotateImage(this.gloves.right.hand, -16.5), bodyX + 262, bodyY + 536, this.gloves.right.hand.width, this.gloves.right.hand.height);




        // Body
        ctx.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY, this.body.width, this.body.height);

        // Pants
        //ctx.drawImage(Utils.canvasTintImage(this.basicPants, Utils.getRandomHexColor()), xDecal - 131, bodyY + 525, this.basicPants.width, this.basicPants.height);
        ctx.drawImage(Utils.canvasRotateImage(this.pants.upper_right, -8, true), xDecal - 54, bodyY + 490, this.pants.upper_right.width, this.pants.upper_right.height);
        ctx.drawImage(Utils.canvasRotateImage(this.pants.lower_right, -2, true), xDecal - 46, bodyY + 785, this.pants.lower_right.width, this.pants.lower_right.height);

        ctx.drawImage(this.pants.hip, xDecal - 188, bodyY + 445, this.pants.hip.width, this.pants.hip.height);
        ctx.drawImage(Utils.canvasRotateImage(this.pants.upper_left, 8, true), xDecal - 198, bodyY + 490, this.pants.upper_left.width, this.pants.upper_left.height);
        ctx.drawImage(Utils.canvasRotateImage(this.pants.lower_left, 7, true), xDecal - 240, bodyY + 790, this.pants.lower_left.width, this.pants.lower_left.height);


        // Boots
        ctx.drawImage(Utils.canvasRotateImage(this.boots.lower_left, 7, true), xDecal - 238, bodyY + 800, this.boots.lower_left.width, this.boots.lower_left.height);
        ctx.drawImage(Utils.canvasRotateImage(this.boots.foot_left, 0, true), bodyX, bodyY + 1053, this.boots.foot_left.width, this.boots.foot_left.height);


        ctx.drawImage(Utils.canvasRotateImage(this.boots.lower_right, 0, true), xDecal - 42, bodyY + 780, this.boots.lower_right.width, this.boots.lower_right.height);
        ctx.drawImage(Utils.canvasRotateImage(this.boots.foot_right, 0, true), xDecal + 4, bodyY + 1053, this.boots.foot_right.width, this.boots.foot_right.height);


        // Body Armor
        ctx.drawImage(this.armor.body, bodyX + 25, bodyY + 155, this.armor.body.width, this.armor.body.height);

        // Neck
        ctx.drawImage(this.armor.neck, bodyX + 105, bodyY + 90, this.armor.neck.width, this.armor.neck.height);


        // Head
        ctx.drawImage(Utils.canvasTintImage(this.head, this.bodyColor), bodyX, bodyY, this.head.width, this.head.height);

        // Eyes
        ctx.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal - 35, bodyY + 62, this.eyebrow.width, this.eyebrow.height);
        ctx.drawImage(this.eyesBack, xDecal - 35, bodyY + 63, this.eyesBack.width, this.eyesBack.height);
        ctx.drawImage(Utils.canvasTintImage(this.eyes, "#FF0000", 0.2), xDecal - 35, bodyY + 63, this.eyes.width, this.eyes.height);

        // Hair
        ctx.drawImage(Utils.canvasTintImage(this.hair, this.hairColor), bodyX - 36, bodyY - 242, this.hair.width, this.hair.height);

        // Ear / Nose
        ctx.drawImage(Utils.canvasTintImage(this.ear, this.bodyColor), xDecal - 188, bodyY - 20, this.ear.width, this.ear.height);
        ctx.drawImage(Utils.canvasTintImage(this.nose, this.bodyColor), xDecal - 42, bodyY + 67, this.nose.width, this.nose.height);

        // Mounth
        if (this.teeths) {
            ctx.drawImage(this.teeths, xDecal - 30, bodyY + 136, this.teeths.width, this.teeths.height);
        }
        ctx.drawImage(Utils.canvasTintImage(this.lips, this.bodyColor), xDecal - 30, bodyY + 136, this.lips.width, this.lips.height);

        // Left Arm
        ctx.drawImage(Utils.canvasTintImage(this.leftArm, this.bodyColor), bodyX, bodyY, this.leftArm.width, this.leftArm.height);

        ctx.drawImage(Utils.canvasRotateImage(this.armor.upper_left, 13, true), bodyX - 32, bodyY + 205);
        ctx.drawImage(Utils.canvasRotateImage(this.armor.lower_left, -5, true), bodyX - 24, bodyY + 395);


        ctx.drawImage(Utils.canvasRotateImage(this.gloves.left.wrist, 0), bodyX - 30, bodyY + 386, this.gloves.left.wrist.width, this.gloves.left.wrist.height);
        ctx.drawImage(Utils.canvasRotateImage(this.gloves.left.hand, -11), bodyX - 15, bodyY + 548, this.gloves.left.hand.width, this.gloves.left.hand.height);

        // Helmet Front
        ctx.drawImage(this.helmet.front, bodyX - 30, bodyY - 158, this.helmet.front.width, this.helmet.front.height);


        console.timeEnd("Draw Images");

        return canvasCharacter;

    }



    static updateCache(key, value) {
        CharacterAppearance.cache[key] = value;
    }

    /**
     * 
     * @param {string} url
     */
    static async getImage(url) {
        if (!url) {
            return null;
        }

        let img = CharacterAppearance.cache[url] ? CharacterAppearance.cache[url] : await Canvas.loadImage(url);
        CharacterAppearance.updateCache(url, img);
        return img;
    }

}

module.exports = CharacterAppearance;