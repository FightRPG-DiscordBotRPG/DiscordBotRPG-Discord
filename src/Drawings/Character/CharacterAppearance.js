const Canvas = require("canvas");
const Utils = require("../../Utils");
const AppearancePositions = require("./Appearances/AppearancePositions");
const FemaleAppearancePositions = require("./Appearances/FemaleAppearancePositions");
const MaleAppearancePositions = require("./Appearances/MaleAppearancePositions");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const User = require("../../Users/User");
const Emojis = require("../Emojis");
const hash = require('object-hash');
const { default: axios } = require("axios");
const conf = require("../../../conf/conf");
const FormData = require('form-data');
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Globals = require("../../Globals");

class CharacterAppearance {
    /**
     * @type Object<string, Canvas.Image>
     */
    static cache = {};

    /**
     * @type Object<number, {id:number,link:string,appearanceType:number,idBodyType:number|null,canBeDisplayedOnTop:boolean,linkedTo:number[]}>
     */
    static possibleAppearances = null;

    /**
     * @type Object<number, {idBodyType: number, body: string, head: string, left: string, right: string, left_leg: string}>
     */
    static bodyAppearances = null;

    /**
     * @type Object<string, Object<number, {"id":number,"link":string,"appearanceType":number,"idBodyType":number|null,"canBeDisplayedOnTop":boolean,"linkedTo":number[]}>[]>
     */
    static appearancesPerTypes = {};

    static basicPantsPerBodyTypes = {
        1: {
            hip: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_hip.png",
            upper_left: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_upper_left.png",
            upper_right: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Male_upper_right.png"
        },
        2: {
            hip: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_hip.png",
            upper_left: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_upper_left.png",
            upper_right: "https://cdn.fight-rpg.com/images/appearances/base/pants/Base%2001%20Female_upper_right.png",
        }
    }

    static basicArmorPerBodyTypes = {
        1: {
            body: null
        },
        2: {
            body: "https://cdn.fight-rpg.com/images/appearances/base/armors/Base%2000%20Female.png"
        }
    }

    /**
    * @type {Object<string, string>}
    **/
    static uploadedImagesCacheLinks = {};

    static defaultAxios = axios.create({
        baseURL: conf.cdnAppearanceCache
    });


    /**
     * @type Object<number, AppearancePositions>
     */
    static itemsPositions = {
        1: MaleAppearancePositions,
        2: FemaleAppearancePositions
    }

    static appearanceType = {
        ear: 1,
        eyes: 3,
        eyebrow: 4,
        nose: 5,
        facialHair: 6,
        hair: 7,
        mouth: 10,
    }

    static emojisTypesWithValues = {
        [Emojis.general.ear]: 1,
        [Emojis.general.eye]: 3,
        [Emojis.general.eyebrow]: 4,
        [Emojis.general.nose]: 5,
        [Emojis.general.facial_hair]: 6,
        [Emojis.general.haircut]: 7,
        [Emojis.general.mouth]: 10,
        [Emojis.general.humans_couple]: 0
    };

    static emojisForTypes = Object.keys(CharacterAppearance.emojisTypesWithValues);

    constructor() {
        this.reset();
        this.editionSelectedIndex = null;
        this.editionSelectedType = null;
        this.editionPossibleValues = [];
        /**
         * @type string[]
         **/
        this.selectableHairColors = null;
        /**
         * @type string[]
         **/
        this.selectableBodyColors = null;
        /**
         * @type string[]
         **/
        this.selectableEyeColors = null;
        /**
         * @type string[]
         **/
        this.selectableBodyTypes = null;
        /**
         * @type number[]
         **/
        this.requiredAppearancesTypeForCharacter = null;
        /**
         * @type Object<number, number>
         **/
        this.editionSelectedPerTypes = {};
        /**
         *  @type {MessageReactionsWrapper}
         **/
        this.editionMessageWrapper = null;
        /**
         * @type {Object<string, 
         { 
            maskColors: {source: string, target: string}[],
            maskLink: string
         }
         >}
         **/
        this.typesMasks = {};
    }

    reset() {

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
        this.typesMasks = {};
        this.allLinks = ""
    }

    async debugLoadAssets() {

        this.bodyColor = "#FF0000";

        let debugFacialHair = Utils.randRangeInteger(0, 17).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        //this.facialHair = await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

        this.background = await this.getImage("https://img00.deviantart.net/b5ba/i/2016/117/d/2/cracked_landsape_by_thechrispman-da0ehq0.png");
        let name = this.bodyType === 2 ? "fe" : "";

        this.body = await this.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_body.png");
        this.head = await this.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_head_full.png");
        this.left = await this.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_left_arm_full.png");
        this.right = await this.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_right_arm_full.png");
        this.left_leg = await this.getImage("http://cdn.fight-rpg.com/images/appearances/base/bodies/" + name + "male_left_leg_full.png");

        this.ear = await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Ear\\0${Utils.randRangeInteger(0, 2)}.png`);

        let debugEyes = Utils.randRangeInteger(0, 15).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.eyes = {
            front: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_02.png`),
            back: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\${debugEyes}_01.png`)
        }

        this.hairColor = Utils.getRandomHexColor();

        let debugHair = Utils.randRangeInteger(0, 0);

        this.hair = {
            front: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`),
            back: [4, 5, 11, 13, 14, 15, 16, 17, 19, 20].includes(parseInt(debugHair)) ? await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${debugHair.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`) : null
            //back: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Hair\\${Utils.getRandomItemsInArray([4, 5, 11, 13, 14, 15, 16, 17, 19, 20], 1).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`)
        }

        // Mouth
        let debugMouth = Utils.randRangeInteger(7, 7);

        this.mouth = {
            lips: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`),
            teeths: [3, 6, 7].includes(parseInt(debugMouth)) ? await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Mouth\\${debugMouth.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}_back.png`) : null
        }


        this.eyebrow = await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyebrow\\${Utils.randRangeInteger(0, 14).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);
        this.nose = await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Nose\\${Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

        this.weapon = {
            bow: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Bow\\Bow 03.png`),
            //main: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Two Handed\\base\\Staff 00.png`),
            //offhand: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Two Handed\\base\\Staff 00.png`),
            //shield: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Shield\\Shield 00_back.png`),
        }

    }

    async loadAssets() {

        let debugGloves = Utils.randRangeInteger(0, 0).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        let name = this.bodyType === 2 ? "fe" : "";

        this.gloves = {
            left: {
                wrist: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_01.png`),
                hand: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_04.png`),
            },
            right: {
                wrist: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_02.png`),
                hand: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy-${debugGloves}_05.png`),
            }
        }

        let debugHelmet = Utils.randRangeInteger(0, 21).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        let doesHelmetHaveBack = ["07", "08", "09"].includes(debugHelmet);

        this.helmet = {
            back: doesHelmetHaveBack ? await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugHelmet}_02.png`) : null,
            front: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugHelmet + (doesHelmetHaveBack ? "_01" : "")}.png`),
        }


        let debugArmor = Utils.randRangeInteger(6, 6).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        this.armor = {
            body: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_body.png`),
            neck: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_neck.png`),
            lower_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_lower_left.png`),
            lower_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_lower_right.png`),
            upper_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_upper_left.png`),
            upper_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\Fantasy ${debugArmor} ${name}Male_upper_right.png`),
        }

        let debugPants = Utils.randRangeInteger(9, 9).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });;

        this.pants = {
            hip: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_hip.png`),
            upper_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_upper_right.png`),
            upper_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_upper_left.png`),
            lower_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_lower_right.png`),
            lower_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy ${debugPants} ${name}Male_lower_left.png`),
        }

        let debugBoots = Utils.randRangeInteger(3, 3).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

        this.boots = {
            lower_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_left.png`),
            lower_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_lower_right.png`),
            foot_left: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_left.png`),
            foot_right: await this.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\Fantasy ${debugBoots}_foot_right.png`),
        }

    }

    /**
     * 
     **/
    async getCharacter() {

        //await this.loadAssets();

        const imageHeight = 1300, imageWidth = 1000;
        const positions = this.getPositions();


        const canvasCharacter = Canvas.createCanvas(imageWidth, imageHeight);

        this.canvasContext = canvasCharacter.getContext("2d");

        this.drawImage(this.background, 0, 0, canvasCharacter.height * (this.background.width / this.background.height), canvasCharacter.height);

        /*console.time("Draw Images");*/

        let bodyX = 250, bodyY = imageHeight - this.body.height - 20;
        let xDecal = bodyX + this.body.width / 2;


        // Back Hair
        this.drawImage(Utils.canvasTintImage(this.hair?.back, this.hairColor), bodyX + positions.hair.x, bodyY + positions.hair.y);

        // Helmet Back
        if (this.shouldDisplayHelmet) {
            this.drawImage(await this.applyColor(this.helmet?.back, "helmet.back"), bodyX + positions.helmet.x, bodyY + positions.helmet.y);
        }

        // Right Shield (offhand)
        this.drawImage(Utils.canvasRotateImage(this.weapon?.shield, positions.weapon.offhand.rotation, true), bodyX + positions.weapon.offhand.x, bodyY + positions.weapon.offhand.y);


        // Right Arm
        this.drawImage(Utils.canvasTintImage(this.right, this.bodyColor), bodyX, bodyY);

        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.armor?.upper_right, "armor.upper_right"), positions.armor.upper_right.rotation), bodyX + positions.armor.upper_right.x, bodyY + positions.armor.upper_right.y);
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.armor?.lower_right, "armor.lower_right"), positions.armor.lower_right.rotation, true), bodyX + positions.armor.lower_right.x, bodyY + positions.armor.lower_right.y);

        // Glove Right
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.gloves?.right?.wrist, "gloves.right.wrist"), positions.gloves.right.wrist.rotation), bodyX + positions.gloves.right.wrist.x, bodyY + positions.gloves.right.wrist.y, this.gloves?.right?.wrist?.width * positions.gloves.wristScale, this.gloves?.right?.wrist?.height * positions.gloves.wristScale);
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.gloves?.right?.hand, "gloves.right.hand"), positions.gloves.right.hand.rotation), bodyX + positions.gloves.right.hand.x, bodyY + positions.gloves.right.hand.y, this.gloves?.right?.hand?.width * positions.gloves.scale, this.gloves?.right?.hand?.height * positions.gloves.scale);

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
        if (!this.armor) {
            await this.loadBaseArmor();
        }

        this.drawImage(await this.applyColor(this.armor?.body, "armor.body"), bodyX + positions.armor.body.x, bodyY + positions.armor.body.y);

        // Neck
        this.drawImage(await this.applyColor(this.armor?.neck, "armor.neck"), bodyX + positions.armor.neck.x, bodyY + positions.armor.neck.y);


        // Head
        this.drawImage(Utils.canvasTintImage(this.head, this.bodyColor), bodyX, bodyY);

        // Eyes
        this.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal + positions.eyes.x, bodyY + positions.eyes.y);
        this.drawImage(this.eyes?.back, xDecal + positions.eyes.x, bodyY + positions.eyes.y);
        this.drawImage(Utils.canvasTintImage(this.eyes?.front, this.eyeColor, 0.6), xDecal + positions.eyes.x, bodyY + positions.eyes.y);

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


        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.armor?.upper_left, "armor.upper_left"), positions.armor.upper_left.rotation, true), bodyX + positions.armor.upper_left.x, bodyY + positions.armor.upper_left.y);
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.armor?.lower_left, "armor.lower_left"), positions.armor.lower_left.rotation, true), bodyX + positions.armor.lower_left.x, bodyY + positions.armor.lower_left.y);

        // Gloves left
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.gloves?.left?.wrist, "gloves.left.wrist"), positions.gloves.left.wrist.rotation), bodyX + positions.gloves.left.wrist.x, bodyY + positions.gloves.left.wrist.y, this.gloves?.left?.wrist?.width * positions.gloves.wristScale, this.gloves?.left?.wrist?.height * positions.gloves.wristScale);
        this.drawImage(Utils.canvasRotateImage(await this.applyColor(this.gloves?.left?.hand, "gloves.left.hand"), positions.gloves.left.hand.rotation), bodyX + positions.gloves.left.hand.x, bodyY + positions.gloves.left.hand.y, this.gloves?.left?.hand?.width * positions.gloves.scale, this.gloves?.left?.hand?.height * positions.gloves.scale);

        // Helmet Front
        if (this.shouldDisplayHelmet) {
            this.drawImage(await this.applyColor(this.helmet?.front, "helmet.front"), bodyX + positions.helmet.x, bodyY + positions.helmet.y);
        }


        //console.timeEnd("Draw Images");

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
     * @param {Canvas.Image | null} image
     * @param {string} maskType
     */
    async applyColor(image, maskType) {
        return Utils.canvasApplyMask({ image: image, mask: await this.getImage(this.typesMasks[maskType]?.maskLink), colorsToReplace: this.typesMasks[maskType]?.maskColors })
    }

    /**
     * 
     * @param {Object<string, {link: string}>} dict
     */
    async mapProperties(dict) {

        if (dict == null) {
            return;
        }

        //let toMerge = {};
        let loadingImages = [];

        for (let i of Object.keys(dict)) {
            let props = i.split(".");

            let ref = this;
            for (let pIndex in props) {
                if (pIndex == props.length - 1) {
                    let refAsync = ref;
                    let prop = props[pIndex];

                    let link = null;;
                    if (typeof dict[i] === "string") {
                        link = dict[i];
                    } else if (dict[i] !== null) {
                        link = dict[i].link;
                    }

                    loadingImages.push((async () => {
                        if (refAsync === null || (typeof link !== "string" && link !== null)) {
                            return;
                        }
                        //console.log(prop + " & " + link);
                        refAsync[prop] = await this.getImage(link);
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
        profRef = await this.getImage(link);
    }

    async setupFromData(appearance) {
        this.reset();
        this.hairColor = appearance.hairColor;
        this.bodyColor = appearance.bodyColor;
        this.eyeColor = appearance.eyeColor;
        this.bodyType = appearance.body.idBodyType;
        this.shouldDisplayHelmet = appearance.displayHelmet == 1;
        if (appearance.areaImage) {
            appearance.appearances["background"] = appearance.areaImage;
        }
        await this.mapProperties(appearance.appearances);
        await this.mapProperties(appearance.body);
    }


    static updateCache(key, value) {
        if (value) {
            CharacterAppearance.cache[key] = value;
        }
    }

    /**
     * 
     * @param {string} url
     */
    async getImage(url) {

        if (!url) {
            return null;
        }

        this.allLinks += url;
        let img = CharacterAppearance.cache[url];
        if (!img) {
            try {
               img = await Canvas.loadImage(url)
            } catch { console.log("Unable to load image " + url); };
        }
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
                (async () => { this.pants.hip = await this.getImage(pants.hip) })(),
                (async () => { this.pants.upper_left = await this.getImage(pants.upper_left) })(),
                (async () => { this.pants.upper_right = await this.getImage(pants.upper_right) })(),
            ]);
    }

    async loadBaseArmor() {
        const armor = CharacterAppearance.basicArmorPerBodyTypes[this.bodyType] ?? CharacterAppearance.basicArmorPerBodyTypes[1];
        this.armor = {
            body: await this.getImage(armor.body)
        }
    }



    getHash() {
        if (!this.allLinks) {
            return null;
        }

        return hash(
            this.allLinks +
            this.hairColor +
            this.bodyColor +
            this.eyeColor +
            this.shouldDisplayHelmet
        );
    }

    /**
     * 
     * @param {Discord.MessageEmbed} embed
     */
    async addCurrentImageToEmbed(embed) {

        const hashFile = this.getHash();
        let cachedLink = CharacterAppearance.uploadedImagesCacheLinks[hashFile];

        // Test Cache
        if (cachedLink && hashFile) {
            return embed.setImage(cachedLink.url);
        }

        const filename = hashFile + ".png";

        // Test if cdn cache is configured
        // If you use this and you try to edit and embed, the image is not updated /!\
        if (!conf.cdnAppearanceCache || !hashFile) {
            return embed
                .attachFiles(new Discord.MessageAttachment((await this.getCharacter()).createPNGStream(), "character.png"))
                .setImage("attachment://character.png");
        }

        // Test cache cdn and upload if needed
        const data = (await CharacterAppearance.defaultAxios.get("get_cache.php?filename=" + filename)).data;

        if (!data.cached) {
            // Upload

            const fileToCache = (await this.getCharacter()).createPNGStream();
            const fData = new FormData();

            fData.append('key', conf.cdnKey);
            fData.append('fileToCache', fileToCache, filename);

            await CharacterAppearance.defaultAxios.post(
                "upload_cache.php",
                fData,
                {
                    headers: fData.getHeaders()
                }
            );

        }

        return embed
            .setImage(conf.cdnAppearanceCache + filename);
    }

    /**
     * 
     * @param {User} user
     */
    async getSelectEmbed(user) {
        return await this.addCurrentImageToEmbed(new Discord.MessageEmbed()
            .setAuthor(Translator.getString(user.lang, "appearance", "title"))
            .setDescription(Translator.getString(user.lang, "appearance", "desc_select", [Emojis.general.clipboard]))
        );

    }

    /**
     *
     * @param {User} user
     */
    async getEditGeneralEmbed(user) {
        return await this.addCurrentImageToEmbed(new Discord.MessageEmbed()
            .setAuthor(Translator.getString(user.lang, "appearance", "title"))
            .setDescription(
                `${Translator.getString(user.lang, "appearance", "choose_modify")}
                - ${this.getTypeDisplay(1, user.lang)}
                - ${this.getTypeDisplay(3, user.lang)}
                - ${this.getTypeDisplay(4, user.lang)}
                - ${this.getTypeDisplay(5, user.lang)}
                - ${this.getTypeDisplay(6, user.lang)}
                - ${this.getTypeDisplay(7, user.lang)}
                - ${this.getTypeDisplay(10, user.lang)}
                - ${this.getTypeDisplay(0, user.lang)}
                - ${Emojis.general.g_vmark} ${Translator.getString(user.lang, "general", "validate")}`
            ));
    }

    getTypeDisplay(type, lang = "en") {
        switch (type) {
            case 1:
                return Emojis.general.ear + " " + Translator.getString(lang, "appearance", "ears");
            case 3:
                return Emojis.general.eye + " " + Translator.getString(lang, "appearance", "eyes");
            case 4:
                return Emojis.general.eyebrow + " " + Translator.getString(lang, "appearance", "eyebrows");
            case 5:
                return Emojis.general.nose + " " + Translator.getString(lang, "appearance", "nose");
            case 6:
                return Emojis.general.facial_hair + " " + Translator.getString(lang, "appearance", "facial_hair");
            case 7:
                return Emojis.general.haircut + " " + Translator.getString(lang, "appearance", "haircut");
            case 10:
                return Emojis.general.mouth + " " + Translator.getString(lang, "appearance", "mouth");
            case 0:
                return Emojis.general.humans_couple + " " + Translator.getString(lang, "appearance", "body_type");
        }

        return "";
    }

    /**
     * 
     * @param {User} user
     */
    async getEditSelectOneEmbed(user) {

        const stringAppearances = this.editionPossibleValues.map((item, i) => i == this.editionSelectedIndex ? "[**" + (i + 1) + "**]" : i + 1).join(", ");

        let embed = await this.addCurrentImageToEmbed(new Discord.MessageEmbed()
            .setAuthor(Translator.getString(user.lang, "appearance", "title") + " (" + this.getTypeDisplay(this.editionSelectedType, user.lang) + ")")
            .setDescription(Translator.getString(user.lang, "appearance", "desc_select_one"))
            .addField(Translator.getString(user.lang, "appearance", "list_of_possible_for_type"), stringAppearances)
        );

        let stringColors = null;

        switch (this.editionSelectedType) {
            // eyes
            case 3:
                stringColors = this.getColorListDisplay(this.selectableEyeColors, this.eyeColor);
                break;
            case 4:
            case 6:
            case 7:
                stringColors = this.getColorListDisplay(this.selectableHairColors, this.hairColor);
                break;
            case 0:
                stringColors = this.getColorListDisplay(this.selectableBodyColors, this.bodyColor);
                break;
        }

        if (stringColors !== null) {
            embed = embed.addField(Translator.getString(user.lang, "appearance", "list_of_possible_color"), stringColors);
        }


        return embed;
    }

    /**
     * 
     * @param {[]} selectableColorArray
     * @param {any} selectedColor
     */
    getColorListDisplay(selectableColorArray, selectedColor) {
        return selectableColorArray.map((item) => item == selectedColor ? "[**" + item + "**]" : item).join(", ");
    }

    async setupFromDataEdition(data) {
        for (let appearance of Object.values(data.appearances)) {
            if (Object.values(CharacterAppearance.appearanceType).includes(appearance.appearanceType)) {
                this.editionSelectedPerTypes[appearance.appearanceType] = appearance.id;
            }
        }
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {User} user
     */
    async handleEdition(message, user) {

        if (this.editionMessageWrapper?.collector) {
            this.editionMessageWrapper?.collector.stop();
            await this.editionMessageWrapper.edit(Translator.getString(user.lang, "appearance", "modifying_elsewhere"), null, true);
        }

        this.editionMessageWrapper = new MessageReactionsWrapper();

        await this.editionMessageWrapper.load(message, await user.pendingAppearance.getSelectEmbed(user), {
            reactionsEmojis: [Emojis.general.clipboard],
            collectorOptions: {
                time: 600000,
            }
        });

        // For tutorial
        //await user.tutorial.reactOnCommand("info", message, user.lang);
        this.editionMessageWrapper.resetCollectListener();
        this.editionMessageWrapper.collector.on('collect', async (reaction) => {
            if (reaction.emoji.name == Emojis.general.clipboard) {
                await this.handleEditionSelectType(user);
            }
        });
    }

    /**
     * 
     * @param {User} user
     */
    async handleEditionSelectType(user) {

        this.editionMessageWrapper.resetCollectListener();
        await this.editionMessageWrapper.edit(await this.getEditGeneralEmbed(user), [...CharacterAppearance.emojisForTypes, Emojis.general.g_vmark]);

        this.editionMessageWrapper.collector.on('collect', async (reaction) => {
            if (CharacterAppearance.emojisForTypes.includes(reaction.emoji.name)) {
                this.editionSelectedType = CharacterAppearance.emojisTypesWithValues[reaction.emoji.name];

                const isBodyType = this.editionSelectedType > 0;

                if (isBodyType) {
                    this.editionPossibleValues = Object.values(CharacterAppearance.appearancesPerTypes[this.editionSelectedType]).filter(i => i.idBodyType === null || i.idBodyType == this.bodyType);
                    this.editionSelectedIndex = this.editionPossibleValues.findIndex(item => item.id == this.editionSelectedPerTypes[item.appearanceType]);
                } else {
                    this.editionPossibleValues = [1, 2];
                    this.editionSelectedIndex = this.editionPossibleValues.findIndex(item => item == this.bodyType);
                }

                await this.handleEditionSelectOne(user);
            } else if (reaction.emoji.name === Emojis.general.g_vmark) {
                const data = (await user.axios.post("/game/character/appearance", {
                    bodyColor: this.bodyColor,
                    hairColor: this.hairColor,
                    eyeColor: this.eyeColor,
                    bodyType: this.bodyType,
                    selectedAppearances: Object.values(this.editionSelectedPerTypes).join(",")
                })).data;

                if (data.error) {
                    await this.editionMessageWrapper.message.channel.send(data.error);
                } else {
                    await this.editionMessageWrapper.deleteAndSend(data.success);
                }

            }
        });

    }

    async handleEditionSelectOne(user) {


        let emojisPossible = [Emojis.general.left_arrow, Emojis.general.right_arrow];
        let colorsArrayRef = null;
        let selectedColor = null;
        let modifyFunc = null;

        switch (this.editionSelectedType) {
            // eyes
            case 3:
                colorsArrayRef = this.selectableEyeColors;
                selectedColor = this.eyeColor;
                emojisPossible.push(Emojis.general.rainbow);
                modifyFunc = (col) => this.eyeColor = col;
                break;
            case 4:
            case 6:
            case 7:
                colorsArrayRef = this.selectableHairColors;
                selectedColor = this.hairColor;
                emojisPossible.push(Emojis.general.rainbow);
                modifyFunc = (col) => this.hairColor = col;
                break;
            case 0:
                colorsArrayRef = this.selectableBodyColors;
                selectedColor = this.bodyColor;
                emojisPossible.push(Emojis.general.rainbow);
                modifyFunc = (col) => this.bodyColor = col;
                break;
        }

        // Add at the end the validate
        emojisPossible.push(Emojis.general.g_vmark);


        await this.editionMessageWrapper.edit(await this.getEditSelectOneEmbed(user), emojisPossible);

        const canBeNull = this.isSelectedEditionTypeCanBeNull();

        this.editionMessageWrapper.resetCollectListener();
        this.editionMessageWrapper.collector.on('collect', async (reaction) => {
            const oldIndex = this.editionSelectedIndex;
            switch (reaction.emoji.name) {
                case Emojis.general.left_arrow:
                    this.editionSelectedIndex = this.editionSelectedIndex === null ? this.editionPossibleValues.length - 1 : this.editionSelectedIndex - 1;
                    break;
                case Emojis.general.right_arrow:
                    this.editionSelectedIndex = this.editionSelectedIndex === null ? 0 : this.editionSelectedIndex + 1;
                    break;
                case Emojis.general.g_vmark:
                    await this.handleEditionSelectType(user);
                    return;
                case Emojis.general.rainbow:
                    {
                        const index = colorsArrayRef.indexOf(selectedColor);
                        // Must update selected color since the collect is based on it's value
                        selectedColor = colorsArrayRef[index >= colorsArrayRef.length - 1 ? 0 : index + 1]
                        modifyFunc(selectedColor);
                    }
                    break;
            }


            if (this.editionSelectedIndex < 0) {
                this.editionSelectedIndex = canBeNull ? null : this.editionPossibleValues.length - 1;
            } else if (this.editionSelectedIndex >= this.editionPossibleValues.length) {
                this.editionSelectedIndex = canBeNull ? null : 0;
            }

            if (oldIndex !== this.editionSelectedIndex) {
                // Redraw
                const itemSelected = this.editionPossibleValues[this.editionSelectedIndex];

                // Body
                if (this.editionSelectedType === 0) {
                    this.bodyType = itemSelected;

                    let appearanceToReload = {};

                    for (let i of Object.values(this.editionSelectedPerTypes)) {
                        const appearance = CharacterAppearance.possibleAppearances[i];
                        if (appearance.idBodyType !== null && appearance.idBodyType !== this.bodyType) {
                            // TODO: Fix when can't be null
                            appearanceToReload[Globals.appearancesTypesToText[appearance.appearanceType]] = null;
                        }
                    }

                    await this.loadBaseArmor();
                    await this.loadBasePants();
                    await this.mapProperties(appearanceToReload);
                    await this.mapProperties(CharacterAppearance.bodyAppearances[this.bodyType]);
                } else {

                    // Clear value before
                    if (this.editionPossibleValues[oldIndex]) {
                        let appearanceToReload = {
                            [Globals.appearancesTypesToText[this.editionPossibleValues[oldIndex].appearanceType]]: null,
                        };


                        for (let item of this.editionPossibleValues[oldIndex].linkedTo) {
                            const appearance = CharacterAppearance.possibleAppearances[item];
                            appearanceToReload[Globals.appearancesTypesToText[appearance.appearanceType]] = null;
                        }

                        await this.mapProperties(appearanceToReload);
                    }


                    if (itemSelected) {
                        //this.editionSelectedPerTypes
                        this.editionSelectedPerTypes[this.editionSelectedType] = itemSelected.id;

                        let appearanceToReload = {
                            [Globals.appearancesTypesToText[itemSelected.appearanceType]]: itemSelected
                        };

                        for (let item of itemSelected?.linkedTo) {
                            const appearance = CharacterAppearance.possibleAppearances[item];
                            appearanceToReload[Globals.appearancesTypesToText[appearance.appearanceType]] = appearance;
                        }

                        await this.mapProperties(appearanceToReload);
                    }



                }

            }

            await this.editionMessageWrapper.edit(await this.getEditSelectOneEmbed(user), emojisPossible, false);

        });

    }

    /**
     * 
     * @param {any} appearance
     */
    async applyItemAppearances(appearance) {

        if (!appearance.appearances) {
            return;
        }

        const mergedAppearances = Object.assign(appearance.appearances["all"] ?? {}, appearance.appearances[this.bodyType] ?? {});
        await this.mapProperties(mergedAppearances);

        for (let property in mergedAppearances) {
            this.typesMasks[property] = mergedAppearances[property];
        }
    }

    isSelectedEditionTypeCanBeNull() {
        return this.isThisTypeCanBeNull(this.editionSelectedType);
    }

    isThisTypeCanBeNull(idType) {
        return idType > 0 ? !this.requiredAppearancesTypeForCharacter.includes(idType) : false;
    }


}

module.exports = CharacterAppearance;