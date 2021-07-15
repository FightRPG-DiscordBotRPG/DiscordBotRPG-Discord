const fs = require("fs");
const Canvas = require("canvas");
const Utils = require("../src/Utils");

async function start() {

    let path = "W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Weapon\\Shield\\without masks";
    //350x512
    // 190 x 335
    // 190 x 177

    for (let file of fs.readdirSync(path)) {

        if (!file.includes(".png")) {
            continue;
        }


        let img = await Canvas.loadImage(path + "\\" + file);

        let fileName = file.replace(".png", "");

        //console.log(Utils.canvasCut(img, 0, 0, 350, 512).toBuffer());
        fs.writeFileSync(`${path}/../${fileName}_back.png`, Utils.canvasCut(img, 0, 0, 512, 512).toBuffer());

    }

    //fs.writeFileSync("./testAction.png", );
    process.exit();
}

start();