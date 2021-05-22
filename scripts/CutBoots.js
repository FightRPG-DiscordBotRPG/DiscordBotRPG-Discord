const fs = require("fs");
const Canvas = require("canvas");
const Utils = require("../src/Utils");

async function start() {

    let path = "W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Boots\\without masks";

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
        fs.writeFileSync(`${path}/../${fileName}_lower_left.png`, Utils.canvasCut(img, 0, 0, 256, 400).toBuffer());

        fs.writeFileSync(`${path}/../${fileName}_lower_right.png`, Utils.canvasCut(img, 512, 0, 256, 400).toBuffer());


        fs.writeFileSync(`${path}/../${fileName}_foot_right.png`, Utils.canvasCut(img, 768, 170, 256, 170).toBuffer());

        fs.writeFileSync(`${path}/../${fileName}_foot_left.png`, Utils.canvasCut(img, 768, 340, 178, 170).toBuffer());
    }

    //fs.writeFileSync("./testAction.png", );
    process.exit();
}

start();