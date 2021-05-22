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
        this.canvasContext = null;

        this.bodyColor = null;

        this.background = null;
        this.body = null;
        this.head = null;
        this.leftArm = null;
        this.rightArm = null;
        this.ear = null;

        this.eyesBack = null;
        this.eyes = null;


        this.eyebrow = null;
        this.nose = null;
        this.gloves = null

        this.helmet = null;
        this.armor = null;

        this.basicPants = null;

        this.pants = null;

        this.hair = null;

        // Back Hair
        this.backHair = null;
        this.teeths = null;

        this.lips = null;


        this.boots = null
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

        this.canvasContext = canvasCharacter.getContext("2d");
        this.drawImage(this.background, 0, 0, canvasCharacter.width, canvasCharacter.height);

        console.time("Draw Images");

        let bodyX = 250, bodyY = imageHeight - this.body.height;
        let xDecal = bodyX + this.body.width / 2;


        // Back Hair
        this.drawImage(Utils.canvasTintImage(this.backHair, this.hairColor), bodyX - 36, bodyY - 242);

        // Helmet Back
        this.drawImage(this.helmet.back, bodyX - 30, bodyY - 158);

        // Right Arm
        this.drawImage(Utils.canvasTintImage(this.rightArm, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor.upper_right, 1), bodyX + 210, bodyY + 205);
        this.drawImage(Utils.canvasRotateImage(this.armor.lower_right, -12, true), bodyX + 250, bodyY + 375);

        // Glove Right
        this.drawImage(Utils.canvasRotateImage(this.gloves.right.wrist, -10), bodyX + 237, bodyY + 379);
        this.drawImage(Utils.canvasRotateImage(this.gloves.right.hand, -12), bodyX + 262, bodyY + 530);




        // Body
        this.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY);

        // Pants
        //this.drawImage(Utils.canvasTintImage(this.basicPants, Utils.getRandomHexColor()), xDecal - 131, bodyY + 525, this.basicPants.width, this.basicPants.height);
        this.drawImage(Utils.canvasRotateImage(this.pants.upper_right, -8, true), xDecal - 54, bodyY + 490);
        this.drawImage(Utils.canvasRotateImage(this.pants.lower_right, -2, true), xDecal - 46, bodyY + 785);

        this.drawImage(this.pants.hip, xDecal - 188, bodyY + 445, this.pants.hip.width, this.pants.hip.height);
        this.drawImage(Utils.canvasRotateImage(this.pants.upper_left, 8, true), xDecal - 198, bodyY + 490);
        this.drawImage(Utils.canvasRotateImage(this.pants.lower_left, 7, true), xDecal - 240, bodyY + 790);


        // Boots
        this.drawImage(Utils.canvasRotateImage(this.boots.lower_left, 7, true), xDecal - 238, bodyY + 800);
        this.drawImage(Utils.canvasRotateImage(this.boots.foot_left, 0, true), bodyX, bodyY + 1053);


        this.drawImage(Utils.canvasRotateImage(this.boots.lower_right, 0, true), xDecal - 42, bodyY + 780);
        this.drawImage(Utils.canvasRotateImage(this.boots.foot_right, 0, true), xDecal + 4, bodyY + 1053);


        // Body Armor
        this.drawImage(this.armor.body, bodyX + 25, bodyY + 155);

        // Neck
        this.drawImage(this.armor.neck, bodyX + 105, bodyY + 90);


        // Head
        this.drawImage(Utils.canvasTintImage(this.head, this.bodyColor), bodyX, bodyY);

        // Eyes
        this.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal - 35, bodyY + 62);
        this.drawImage(this.eyesBack, xDecal - 35, bodyY + 63);
        this.drawImage(Utils.canvasTintImage(this.eyes, "#FF0000", 0.2), xDecal - 35, bodyY + 63);

        // Hair
        this.drawImage(Utils.canvasTintImage(this.hair, this.hairColor), bodyX - 36, bodyY - 242);

        // Ear / Nose
        this.drawImage(Utils.canvasTintImage(this.ear, this.bodyColor), xDecal - 188, bodyY - 20);
        this.drawImage(Utils.canvasTintImage(this.nose, this.bodyColor), xDecal - 42, bodyY + 67);

        // Mounth
        this.drawImage(this.teeths, xDecal - 30, bodyY + 136);

        this.drawImage(Utils.canvasTintImage(this.lips, this.bodyColor), xDecal - 30, bodyY + 136);

        // Left Arm
        this.drawImage(Utils.canvasTintImage(this.leftArm, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor.upper_left, 13, true), bodyX - 32, bodyY + 205);
        this.drawImage(Utils.canvasRotateImage(this.armor.lower_left, -5, true), bodyX - 24, bodyY + 395);

        // Gloves left
        this.drawImage(Utils.canvasRotateImage(this.gloves.left.wrist, 0), bodyX - 30, bodyY + 386);
        this.drawImage(Utils.canvasRotateImage(this.gloves.left.hand, -11), bodyX - 15, bodyY + 548);

        // Helmet Front
        this.drawImage(this.helmet.front, bodyX - 30, bodyY - 158);


        console.timeEnd("Draw Images");

        return canvasCharacter;

    }

    /**
     * 
     * @param {Canvas.Image | Canvas.Canvas} img
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    drawImage(img, x, y, width, height) {
        if (img) {
            this.canvasContext.drawImage(img, x, y, width ?? img.width, height ?? img.height);
        }
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