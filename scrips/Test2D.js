const fs = require("fs");
const CharacterAppearance = require("../src/Drawings/Character/CharacterAppearance");

async function start() {
    fs.writeFileSync("./test.png", await (await (new CharacterAppearance()).getCharacter()).toBuffer());
}

start();