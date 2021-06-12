const Canvas = require("canvas");
const Utils = require("../../Utils");
const AppearancePositions = require("./Appearances/AppearancePositions");
const FemaleAppearancePositions = require("./Appearances/FemaleAppearancePositions");
const MaleAppearancePositions = require("./Appearances/MaleAppearancePositions");

class CharacterAppearance {
    /**
     * @type Object<string, Canvas.Image>
     */
    static cache = {};

    constructor() {
        this.reset();
    }

    reset() {
        this.data = null;

        this.background = null;
        this.canvasContext = null;

        this.bodyColor = null;
        this.bodyType = null;

        this.background = null;
        this.body = null;
        this.head = null;
        this.left = null;
        this.left_leg = null;
        this.right = null;
        this.ear = null;

        this.eyes = null;


        this.eyebrow = null;
        this.nose = null;
        this.gloves = null

        this.helmet = null;
        this.armor = null;

        this.basicPants = null;

        this.pants = null;

        this.hair = null;

        this.mouth = null;


        this.boots = null;

        this.facialHair = null;
        this.shouldDisplayHelmet = false;

        this.weapon = null;
    }

    async debugLoadAssets() {

        this.bodyColor = "#FF0000";

        let debugFacialHair = Utils.randRangeInteger(0, 17).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        //this.facialHair = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

        this.bodyType = 2;
        this.background = await CharacterAppearance.getImage("https://img00.deviantart.net/b5ba/i/2016/117/d/2/cracked_landsape_by_thechrispman-da0ehq0.png");
        let name = this.bodyType === 2 ? "fe" : "";

        this.body = await CharacterAppearance.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_body.png");
        this.head = await CharacterAppearance.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_head_full.png");
        this.left = await CharacterAppearance.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_left_arm_full.png");
        this.right = await CharacterAppearance.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_right_arm_full.png");
        this.left_leg = await CharacterAppearance.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_left_leg_full.png");

        this.ear = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Ear\\0${Utils.randRangeInteger(0, 2)}.png`);

        let debugEyes = Utils.randRangeInteger(0, 15).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.eyes = {
            front: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_02.png`),
            back: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_01.png`)
        }

        this.hairColor = Utils.getRandomHexColor();

        let debugHair = Utils.randRangeInteger(0, 0);

        this.hair = {
            front: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`),
            back: [4, 5, 11, 13, 14, 15, 16, 17, 19, 20].includes(parseInt(debugHair)) ? await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`) : null
            //back: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${Utils.getRandomItemsInArray([4, 5, 11, 13, 14, 15, 16, 17, 19, 20], 1).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`)
        }

        // Mouth
        let debugMouth = Utils.randRangeInteger(7, 7);

        this.mouth = {
            lips: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`),
            teeths: [3, 6, 7].includes(parseInt(debugMouth)) ? await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`) : null
        }


        this.eyebrow = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyebrow\\${Utils.randRangeInteger(0, 14).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);
        this.nose = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Nose\\${Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        this.weapon = {
            bow: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Bow\\Bow 03.png`),
            //main: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Two Handed\\base\\Staff 00.png`),
            //offhand: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Two Handed\\base\\Staff 00.png`),
            //shield: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Shield\\Shield 00_back.png`),
        }

    }

    async loadAssets() {

        let debugGloves = Utils.randRangeInteger(0, 0).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        let name = this.bodyType === 2 ? "fe" : "";

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


        let debugArmor = Utils.randRangeInteger(6, 6).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        this.armor = {
            body: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_body.png`),
            neck: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_neck.png`),
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_lower_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_lower_right.png`),
            upper_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_upper_left.png`),
            upper_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_upper_right.png`),
        }

        let debugPants = Utils.randRangeInteger(9, 9).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });;

        this.pants = {
            hip: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_hip.png`),
            upper_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_upper_right.png`),
            upper_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_upper_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_lower_right.png`),
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_lower_left.png`),
        }

        let debugBoots = Utils.randRangeInteger(3, 3).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.boots = {
            lower_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_left.png`),
            lower_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_right.png`),
            foot_left: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_left.png`),
            foot_right: await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_right.png`),
        }

    }

    /**
     * @type Object<number, AppearancePositions>
     */
    static itemsPositions = {
        1: MaleAppearancePositions,
        2: FemaleAppearancePositions
    }

    /**
     * 
     **/
    async getCharacter() {

        await this.loadAssets();

        const imageHeight = 1300, imageWidth = 1000;
        const positions = this.getPositions();


        const canvasCharacter = Canvas.createCanvas(imageWidth, imageHeight);

        this.canvasContext = canvasCharacter.getContext("2d");

        this.drawImage(this.background, 0, 0, canvasCharacter.height * (this.background.width / this.background.height), canvasCharacter.height);

        console.time("Draw Images");

        let bodyX = 250, bodyY = imageHeight - this.body.height - 20;
        let xDecal = bodyX + this.body.width / 2;


        // Back Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.back, this.hairColor), bodyX + positions.hair.x, bodyY + positions.hair.y);

        // Helmet Back
        if (this.shouldDisplayHelmet) {
            this.drawImage(this.helmet?.back, bodyX + positions.helmet.x, bodyY + positions.helmet.y);
        }

        // Right Shield (offhand)
        this.drawImage(Utils.canvasRotateImage(this.weapon?.shield, positions.weapon.offhand.rotation, true), bodyX + positions.weapon.offhand.x, bodyY + positions.weapon.offhand.y);


        // Right Arm
        this.drawImage(Utils.canvasTintImage(this.right, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_right, positions.armor.upper_right.rotation), bodyX + positions.armor.upper_right.x, bodyY + positions.armor.upper_right.y);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_right, positions.armor.lower_right.rotation, true), bodyX + positions.armor.lower_right.x, bodyY + positions.armor.lower_right.y);

        // Glove Right
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.wrist, positions.gloves.right.wrist.rotation), bodyX + positions.gloves.right.wrist.x, bodyY + positions.gloves.right.wrist.y, this.gloves?.right.wrist.width * positions.gloves.scale, this.gloves?.right.wrist.height * positions.gloves.scale);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.hand, positions.gloves.right.hand.rotation), bodyX + positions.gloves.right.hand.x, bodyY + positions.gloves.right.hand.y, this.gloves?.right.hand.width * positions.gloves.scale, this.gloves?.right.hand.height * positions.gloves.scale);

        // Right weapon (offhand)
        this.drawImage(Utils.canvasRotateImage(this.weapon?.offhand, positions.weapon.offhand.rotation, true), bodyX + positions.weapon.offhand.x, bodyY + positions.weapon.offhand.y);

        // Bow
        this.drawImage(Utils.canvasRotateImage(this.weapon?.bow, positions.weapon.bow.rotation, true), bodyX + positions.weapon.bow.x, bodyY + positions.weapon.bow.y);




        // Body
        this.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY);

        // Pants
        if (!this.pants) {
            await this.loadBasePants();
        }

        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_right, positions.pants.upper_right.rotation, true), xDecal + positions.pants.upper_right.x, bodyY + positions.pants.upper_right.y);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_right, positions.pants.lower_right.rotation, true), xDecal + positions.pants.lower_right.x, bodyY + positions.pants.lower_right.y);

        this.drawImage(this.pants?.hip, xDecal + positions.pants.hip.x, bodyY + positions.pants.hip.y, this.pants?.hip?.width, this.pants?.hip?.height);

        this.drawImage(Utils.canvasTintImage(this.left_leg, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_left, positions.pants.upper_left.rotation, true), xDecal + positions.pants.upper_left.x, bodyY + positions.pants.upper_left.y);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_left, positions.pants.lower_left.rotation, true), xDecal + positions.pants.lower_left.x, bodyY + positions.pants.lower_left.y);


        // Boots
        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_left, positions.boots.lower_left.rotation, true), xDecal + positions.boots.lower_left.x, bodyY + positions.boots.lower_left.y, this.boots?.lower_left.width * positions.boots.scale, this.boots?.lower_left.height);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_left, positions.boots.foot_left.rotation, true), bodyX + positions.boots.foot_left.x, bodyY + positions.boots.foot_left.y, this.boots?.foot_left.width * positions.boots.scale, this.boots?.foot_left.height);


        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_right, positions.boots.lower_right.rotation, true), xDecal + positions.boots.lower_right.x, bodyY + positions.boots.lower_right.y, this.boots?.lower_right.width * positions.boots.scale, this.boots?.lower_right.height);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_right, positions.boots.foot_right.rotation, true), xDecal + positions.boots.foot_right.x, bodyY + positions.boots.foot_right.y, this.boots?.foot_right.width * positions.boots.scale, this.boots?.foot_right.height);


        // Body Armor
        this.drawImage(this.armor?.body, bodyX + positions.armor.body.x, bodyY + positions.armor.body.y);

        // Neck
        this.drawImage(this.armor?.neck, bodyX + positions.armor.neck.x, bodyY + positions.armor.neck.y);


        // Head
        this.drawImage(Utils.canvasTintImage(this.head, this.bodyColor), bodyX, bodyY);

        // Eyes
        this.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal + positions.eyes.x, bodyY + positions.eyes.y);
        this.drawImage(this.eyes?.back, xDecal + positions.eyes.x, bodyY + positions.eyes.y);
        this.drawImage(Utils.canvasTintImage(this.eyes?.front, "#FF0000", 0.2), xDecal + positions.eyes.x, bodyY + positions.eyes.y);

        // Mounth
        this.drawImage(this.mouth?.teeths, xDecal + positions.mouth.teeths.x, bodyY + positions.mouth.teeths.y);

        this.drawImage(Utils.canvasTintImage(this.mouth?.lips, this.bodyColor), xDecal + positions.mouth.lips.x, bodyY + positions.mouth.lips.y);

        // Facial Hair
        this.drawImage(Utils.canvasTintImage(this.facialHair, this.hairColor), bodyX + positions.facialHair.x, bodyY + positions.facialHair.y);

        // Ear / Nose
        this.drawImage(Utils.canvasTintImage(this.ear, this.bodyColor), xDecal + positions.ear.x, bodyY + positions.ear.y);
        this.drawImage(Utils.canvasTintImage(this.nose, this.bodyColor), xDecal + positions.nose.x, bodyY + positions.nose.y);

        // Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.front, this.hairColor), bodyX + positions.hair.x, bodyY + positions.hair.y);


        // Left weapon (main)
        this.drawImage(Utils.canvasRotateImage(this.weapon?.main, positions.weapon.main.rotation, true), bodyX + positions.weapon.main.x, bodyY + positions.weapon.main.y);

        // Left Arm
        this.drawImage(Utils.canvasTintImage(this.left, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_left, positions.armor.upper_left.rotation, true), bodyX + positions.armor.upper_left.x, bodyY + positions.armor.upper_left.y);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_left, positions.armor.lower_left.rotation, true), bodyX + positions.armor.lower_left.x, bodyY + positions.armor.lower_left.y);

        // Gloves left
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.wrist, positions.gloves.left.wrist.rotation), bodyX + positions.gloves.left.wrist.x, bodyY + positions.gloves.left.wrist.y, this.gloves?.left.wrist.width * positions.gloves.scale, this.gloves?.left.wrist.height * positions.gloves.scale);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.hand, positions.gloves.left.hand.rotation), bodyX + positions.gloves.left.hand.x, bodyY + positions.gloves.left.hand.y, this.gloves?.left.hand.width * positions.gloves.scale, this.gloves?.left.hand.height * positions.gloves.scale);

        // Helmet Front
        if (this.shouldDisplayHelmet) {
            this.drawImage(this.helmet?.front, bodyX + positions.helmet.x, bodyY + positions.helmet.y);
        }


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

    /**
     * 
     * @param {Object<string, {link: string}>} dict
     */
    async mapProperties(dict) {

        //let toMerge = {};
        let loadingImages = [];

        for (let i of Object.keys(dict)) {
            let props = i.split(".");

            let ref = this;
            for (let pIndex in props) {
                if (pIndex == props.length - 1) {
                    let refAsync = ref;
                    let prop = props[pIndex];
                    let link = typeof dict[i] === "string" ? dict[i] : dict[i].link;
                    loadingImages.push((async () => {
                        if (refAsync === null || typeof link !== "string") {
                            return;
                        }
                        refAsync[prop] = await CharacterAppearance.getImage(link);
                    })());
                } else {
                    if (!ref[props[pIndex]]) {
                        ref[props[pIndex]] = {};
                    }
                    ref = ref[props[pIndex]];
                }
            }
        }

        await Promise.all(loadingImages);
    }

    async setImageToProperty(profRef, link) {
        if (profRef === null || typeof link !== "string") {
            return;
        }
        profRef = await CharacterAppearance.getImage(link);
    }

    async setupFromData(data) {
        this.reset();
        this.hairColor = data.appearance.hairColor;
        this.bodyColor = data.appearance.bodyColor;
        this.eyeColor = data.appearance.eyeColor;
        this.bodyType = data.appearance.body.idBodyType;
        this.shouldDisplayHelmet = data.appearance.displayHelmet == 1;
        data.appearance.appearances["background"] = data.appearance.areaImage;
        await this.mapProperties(data.appearance.appearances);
        await this.mapProperties(data.appearance.body);

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

    getPositions() {
        return CharacterAppearance.itemsPositions[this.bodyType] ? CharacterAppearance.itemsPositions[this.bodyType] : CharacterAppearance.itemsPositions[1];
    }


    async loadBasePants() {
        const pants = CharacterAppearance.basicPantsPerBodyTypes[this.bodyType] ?? CharacterAppearance.basicPantsPerBodyTypes[1];
        this.pants = {};
        await Promise.all(
            [
                (async () => { this.pants.hip = await CharacterAppearance.getImage(pants.hip) })(),
                (async () => { this.pants.upper_left = await CharacterAppearance.getImage(pants.upper_left) })(),
                (async () => { this.pants.upper_right = await CharacterAppearance.getImage(pants.upper_right) })()
            ]);
    }

    static basicPantsPerBodyTypes = {
        1: {
            hip: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_hip.png",
            upper_left: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_upper_left.png",
            upper_right: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_upper_right.png"
        },
        2: {
            hip: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_hip.png",
            upper_left: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_upper_left.png",
            upper_right: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_upper_right.png"
        }
    }

}

module.exports = CharacterAppearance;