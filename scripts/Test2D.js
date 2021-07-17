const fs = require("fs");
const CharacterAppearance = require("../src/Drawings/Character/CharacterAppearance");

var open = require('open');

async function start() {
    let appearance = new CharacterAppearance();
    await appearance.debugLoadAssets();
    fs.writeFileSync("./test.png", await (await appearance.getCharacter()).toBuffer());

    open("./test.png");
}

async function multipleTest() {
    for (let i = 0; i <= 17; i++) {

        let debugFacialHair = i.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: true });
        let appearance = new CharacterAppearance();
        appearance.shouldDisplayHelmet = true;
        appearance.bodyType = 2;
        await appearance.debugLoadAssets();
        appearance.facialHair = await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);
        appearance.facialHair = await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

        const doesHelmetHaveBack = ["07", "08", "09"].includes(debugFacialHair);

        //appearance.helmet = {
        //    front: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugFacialHair}_front.png`),
        //    back:  doesHelmetHaveBack ? await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugFacialHair}_back.png`) : null,
        //}

        //appearance.gloves = {
        //    left: {
        //        wrist: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy ${debugFacialHair}_wrist_left.png`),
        //        hand: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy ${debugFacialHair}_hand_left.png`),
        //    },
        //    right: {
        //        wrist: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy ${debugFacialHair}_wrist_right.png`),
        //        hand: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\Fantasy ${debugFacialHair}_hand_right.png`),
        //    },
        //}

        appearance.pants = {
            lower_left: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy 09 Female_real_lower_left.png`),
            upper_left: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy 09 Female_real_upper_left.png`),
            hip: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy 09 Female_real_hip.png`),
            lower_right: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy 09 Female_real_lower_right.png`),
            upper_right: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Pants\\Fantasy 09 Female_real_upper_right.png`),
        }

        fs.writeFileSync("./test" + debugFacialHair + ".png", await (await appearance.getCharacter()).toBuffer());
    }
}

//start();
multipleTest();