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
        this.data = null;

        this.background = null;
        this.canvasContext = null;

        this.bodyColor = null;

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

        let debugFacialHair = Utils.randRangeInteger(0, 17).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.facialHair = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

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
     * 
     **/
    async getCharacter() {

        await this.loadAssets();

        const imageHeight = 1300, imageWidth = 1000;


        const canvasCharacter = Canvas.createCanvas(imageWidth, imageHeight);

        this.canvasContext = canvasCharacter.getContext("2d");

        this.drawImage(this.background, 0, 0, canvasCharacter.height * (this.background.width / this.background.height), canvasCharacter.height);

        console.time("Draw Images");

        let bodyX = 250, bodyY = imageHeight - this.body.height - 20;
        let xDecal = bodyX + this.body.width / 2;


        // Back Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.back, this.hairColor), bodyX - 36, bodyY - 242);

        // Helmet Back
        this.drawImage(this.helmet?.back, bodyX - 30, bodyY - 158);

        // Right Arm
        this.drawImage(Utils.canvasTintImage(this.right, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_right, 1), bodyX + 210, bodyY + 205);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_right, -12, true), bodyX + 250, bodyY + 375);

        // Glove Right
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.wrist, -10), bodyX + 237, bodyY + 379);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.right.hand, -12), bodyX + 262, bodyY + 530);




        // Body
        this.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY);

        // Pants
        //this.drawImage(Utils.canvasTintImage(this.basicPants, Utils.getRandomHexColor()), xDecal - 131, bodyY + 525, this.basicPants.width, this.basicPants.height);
        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_right, -8, true), xDecal - 54, bodyY + 490);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_right, -2, true), xDecal - 46, bodyY + 785);

        this.drawImage(this.pants.hip, xDecal - 188, bodyY + 445, this.pants.hip.width, this.pants.hip.height);
        this.drawImage(Utils.canvasRotateImage(this.pants?.upper_left, 8, true), xDecal - 198, bodyY + 490);
        this.drawImage(Utils.canvasRotateImage(this.pants?.lower_left, 7, true), xDecal - 240, bodyY + 790);


        // Boots
        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_left, 7, true), xDecal - 238, bodyY + 800);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_left, 0, true), bodyX, bodyY + 1053);


        this.drawImage(Utils.canvasRotateImage(this.boots?.lower_right, 0, true), xDecal - 42, bodyY + 780);
        this.drawImage(Utils.canvasRotateImage(this.boots?.foot_right, 0, true), xDecal + 4, bodyY + 1053);


        // Body Armor
        this.drawImage(this.armor?.body, bodyX + 25, bodyY + 155);

        // Neck
        this.drawImage(this.armor?.neck, bodyX + 105, bodyY + 90);


        // Head
        this.drawImage(Utils.canvasTintImage(this.head, this.bodyColor), bodyX, bodyY);

        // Eyes
        this.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal - 35, bodyY + 62);
        this.drawImage(this.eyes?.back, xDecal - 35, bodyY + 63);
        this.drawImage(Utils.canvasTintImage(this.eyes?.front, "#FF0000", 0.2), xDecal - 35, bodyY + 63);

        // Mounth
        this.drawImage(this.mouth?.teeths, xDecal - 30, bodyY + 130);

        this.drawImage(Utils.canvasTintImage(this.mouth?.lips, this.bodyColor), xDecal - 30, bodyY + 136);

        // Facial Hair
        this.drawImage(Utils.canvasTintImage(this.facialHair, this.hairColor), bodyX + 97, bodyY + 15);

        // Ear / Nose
        this.drawImage(Utils.canvasTintImage(this.ear, this.bodyColor), xDecal - 188, bodyY - 20);
        this.drawImage(Utils.canvasTintImage(this.nose, this.bodyColor), xDecal - 42, bodyY + 64);

        // Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.front, this.hairColor), bodyX - 36, bodyY - 242);

        // Left Arm
        this.drawImage(Utils.canvasTintImage(this.left, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(this.armor?.upper_left, 13, true), bodyX - 32, bodyY + 205);
        this.drawImage(Utils.canvasRotateImage(this.armor?.lower_left, -5, true), bodyX - 24, bodyY + 395);

        // Gloves left
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.wrist, 0), bodyX - 30, bodyY + 386);
        this.drawImage(Utils.canvasRotateImage(this.gloves?.left.hand, -11), bodyX - 15, bodyY + 548);

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
                        refAsync[prop] =  await CharacterAppearance.getImage(link);
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

    static async CacheAreasFromDatabase() {
        
    }

}

module.exports = CharacterAppearance;