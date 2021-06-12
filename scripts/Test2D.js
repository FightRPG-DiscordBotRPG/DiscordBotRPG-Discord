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
        await appearance.debugLoadAssets();
        appearance.facialHair = await CharacterAppearance.getImage(`W:\\DocumentsWndows\\FightRPG\\character\\Base\\Facial Hair\\${debugFacialHair}.png`);

        fs.writeFileSync("./test" + debugFacialHair + ".png", await (await appearance.getCharacter()).toBuffer());
    }
}

start();
//multipleTest();