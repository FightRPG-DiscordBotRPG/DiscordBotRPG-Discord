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
		this.leftArm = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_left_arm_full.png");
		this.rightArm = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Body Skin\\male_right_arm_full.png");
		this.ear = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Ear\\0${Utils.randRangeInteger(0, 2)}.png`);
		this.eyes = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\00\\front.png");
		this.eyesBack = await CharacterAppearance.getImage("W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyes\\00\\back.png");
		this.eyebrow = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Eyebrow\\${Utils.randRangeInteger(0, 14).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);
		this.nose = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Nose\\${Utils.randRangeInteger(0, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true })}.png`);

		let debugGloves = Utils.randRangeInteger(10, 10).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });

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

		this.basicPants = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Pants\\male_01.png`);


		this.hairColor = Utils.getRandomHexColor();

		let debugHair = Utils.randRangeInteger(0, 25);

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

		// Right Arm
		ctx.drawImage(Utils.canvasTintImage(this.rightArm, this.bodyColor), bodyX, bodyY, this.rightArm.width, this.rightArm.height);

		ctx.drawImage(Utils.canvasRotateImage(this.gloves.right.wrist, -10), bodyX + 208, bodyY + 400, this.gloves.right.wrist.width, this.gloves.right.wrist.height);
		ctx.drawImage(Utils.canvasRotateImage(this.gloves.right.hand, -16.5), bodyX + 235, bodyY + 557, this.gloves.right.hand.width, this.gloves.right.hand.height);



		// Body
		ctx.drawImage(Utils.canvasTintImage(this.body, this.bodyColor), bodyX, bodyY, this.body.width, this.body.height);


		// Pants
		ctx.drawImage(Utils.canvasTintImage(this.basicPants, Utils.getRandomHexColor()), xDecal - 131, bodyY + 525, this.basicPants.width, this.basicPants.height)

		// Left Arm
		ctx.drawImage(Utils.canvasTintImage(this.leftArm, this.bodyColor), bodyX, bodyY, this.leftArm.width, this.leftArm.height);

		ctx.drawImage(Utils.canvasRotateImage(this.gloves.left.wrist, -5), bodyX - 49, bodyY + 405, this.gloves.left.wrist.width, this.gloves.left.wrist.height);
		ctx.drawImage(Utils.canvasRotateImage(this.gloves.left.hand, -11), bodyX - 34, bodyY + 567, this.gloves.left.hand.width, this.gloves.left.hand.height);

		// Eyes
		ctx.drawImage(Utils.canvasTintImage(this.eyebrow, this.hairColor), xDecal - 35, bodyY + 62, this.eyebrow.width, this.eyebrow.height);
		ctx.drawImage(this.eyesBack, xDecal - 9, bodyY + 92, this.eyes.width, this.eyes.height);
		ctx.drawImage(Utils.canvasTintImage(this.eyes, "#FF0000", 0.2), xDecal - 7, bodyY + 94, this.eyes.width, this.eyes.height);

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
		let img = CharacterAppearance.cache[url] ? CharacterAppearance.cache[url] : await Canvas.loadImage(url);
		CharacterAppearance.updateCache(url, img);
		return img;
	}

}

module.exports = CharacterAppearance;