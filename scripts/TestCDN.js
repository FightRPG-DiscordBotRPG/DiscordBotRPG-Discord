const fs = require("fs");
const { promisify } = require("util");
const conn = require("../conf/mysql");
const writeFile = promisify(fs.writeFileSync);

const CharacterAppearance = require("../src/Drawings/Character/CharacterAppearance");
const Utils = require("../src/Utils");

async function start() {
    const wait = [];
    for (let item of await conn.query("SELECT * FROM pstreepossiblesnodesvisuals")) {
        const iconName = item.icon.split("/").at(-1).split("?").at(0);
        wait.push(createIconAtPath(item.icon, `W:\\DocumentsWndows\\FightRPG\\Spells\\Production\\${iconName}`));
    }

    await Promise.all(wait);
    console.log("It's done!");
    process.exit();
}

async function createIconAtPath(iconUrl, path) {
    await writeFile(path, Utils.canvasRotateImage(await CharacterAppearance.getImage(iconUrl), 0).toBuffer());
}



start();

