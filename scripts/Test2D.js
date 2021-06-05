const fs = require("fs");
const CharacterAppearance = require("../src/Drawings/Character/CharacterAppearance");

var open = require('open');

async function start() {
    let appearance = new CharacterAppearance();
    await appearance.debugLoadAssets();
    fs.writeFileSync("./test.png", await (await appearance.getCharacter()).toBuffer());
    open("./test.png");
}

start();