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
        await appearance.debugLoadAssets();
        appearance.facialHair = await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);
        appearance.facialHair = await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

        const doesHelmetHaveBack = ["07", "08", "09"].includes(debugFacialHair);

        appearance.helmet = {
            front: await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugFacialHair}_front.png`),
            back:  doesHelmetHaveBack ? await appearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Helmet\\Fantasy ${debugFacialHair}_back.png`) : null,
        }

        fs.writeFileSync("./test" + debugFacialHair + ".png", await (await appearance.getCharacter()).toBuffer());
    }
}

//start();
multipleTest();