const Canvas = require("canvas");
const Utils = require("../../Utils");
const AppearancePositions = require("./Appearances/AppearancePositions");
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
    }


    async loadAssets() {

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

        let debugBoots = Utils.randRangeInteger(0, 9).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

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
        1: MaleAppearancePositions
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
        this.drawImage(this.helmet?.back, bodyX + positions.helmet.x, bodyY + positions.helmet.y);

        // Right Arm
        this.drawImage(Utils.canvasTintImage(this.right, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_right, 1), bodyX + positions.armor.upper_right.x, bodyY + positions.armor.upper_right.y);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_right, -12, true), bodyX + positions.armor.lower_right.x, bodyY + positions.armor.lower_right.y);

        // Glove Right
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.wrist, -10), bodyX + positions.gloves.right.wrist.x, bodyY + positions.gloves.right.wrist.y);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.hand, -12), bodyX + positions.gloves.right.hand.x, bodyY + positions.gloves.right.hand.y);




        // Body
        this.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY);

        // Pants
        //this.drawImage(Utils.canvasTintImage(this.basicPants, Utils.getRandomHexColor()), xDecal - 131, bodyY + 525, this.basicPants.width, this.basicPants.height);
        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_right, -8, true), xDecal + positions.pants.upper_right.x, bodyY + positions.pants.upper_right.y);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_right, -2, true), xDecal + positions.pants.lower_right.x, bodyY + positions.pants.lower_right.y);

        this.drawImage(this.pants.hip, xDecal + positions.pants.hip.x, bodyY + positions.pants.hip.y, this.pants.hip.width, this.pants.hip.height);
        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_left, 8, true), xDecal + positions.pants.upper_left.x, bodyY + positions.pants.upper_left.y);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_left, 7, true), xDecal + positions.pants.lower_left.x, bodyY + positions.pants.lower_left.y);


        // Boots
        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_left, 7, true), xDecal  + positions.boots.lower_left.x, bodyY + positions.boots.lower_left.y);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_left, 0, true), bodyX + positions.boots.foot_left.x, bodyY + positions.boots.foot_left.y);


        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_right, 0, true), xDecal  + positions.boots.lower_right.x, bodyY + positions.boots.lower_right.y);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_right, 0, true), xDecal + positions.boots.foot_right.x, bodyY + positions.boots.foot_right.y);


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
        this.drawImage(Utils.canvasTintImage(this.ear, this.bodyColor), xDecal + positions.ear.x, bodyY  + positions.ear.y);
        this.drawImage(Utils.canvasTintImage(this.nose, this.bodyColor), xDecal  + positions.nose.x, bodyY + positions.nose.y);

        // Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.front, this.hairColor), bodyX + positions.hair.x, bodyY + positions.hair.y);

        // Left Arm
        this.drawImage(Utils.canvasTintImage(this.left, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_left, 13, true), bodyX+ positions.armor.upper_left.x, bodyY + positions.armor.upper_left.y);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_left, -5, true), bodyX + positions.armor.lower_left.x, bodyY + positions.armor.lower_left.y);

        // Gloves left
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.wrist, 0), bodyX + positions.gloves.left.wrist.x, bodyY + positions.gloves.left.wrist.y);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.hand, -11), bodyX + positions.gloves.left.hand.x, bodyY + positions.gloves.left.hand.y);

        // Helmet Front
        //this.drawImage(this.helmet?.front, bodyX - 30, bodyY - 158);


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



}

module.exports = CharacterAppearance;