const fs = require("fs");
const Canvas = require("canvas");
const Utils = require("../src/Utils");

async function start() {

    let path = "W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Bow\\base";
    //350x512
    // 190 x 335
    // 190 x 177

    for (let file of fs.readdirSync(path)) {

        if (!file.includes(".png")) {
            continue;
        }


        let img = await Canvas.loadImage(path + "\\" + file);

        let fileName = file.replace(".png", "").replace("mask", "Mask");

        const string = Utils.canvasCut(img, 0, 0, 64, 1024);
        const bow = Utils.canvasCut(img, 64, 0, 448, 1024);

        const canvas = Canvas.createCanvas(448, 1024);

        const context = canvas.getContext("2d");

        context.drawImage(bow, 0, 0);
        context.drawImage(string, 96, 0);


        fs.writeFileSync(`${path}/../${fileName}.png`, canvas.toBuffer());

    }

    //fs.writeFileSync("./testAction.png", );
    process.exit();
}

start();