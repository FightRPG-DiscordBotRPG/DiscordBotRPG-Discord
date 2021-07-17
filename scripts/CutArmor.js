const fs = require("fs");
const Canvas = require("canvas");
const Utils = require("../src/Utils");

async function start() {

    let path = "W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Armor\\base";
    //350x512
    // 190 x 335
    // 190 x 177

    for (let file of fs.readdirSync(path)) {

        if (!file.includes(".png")) {
            continue;
        }


        let img = await Canvas.loadImage(path + "\\" + file);

        let fileName = file.replace(".png", "").replace("mask", "Mask");

        //console.log(Utils.canvasCut(img, 0, 0, 350, 512).toBuffer());
        if (img.width >= 1024) {
            fs.writeFileSync(`${path}/../${fileName}_body.png`, Utils.canvasCut(img, 0, 0, 350, 512).toBuffer());
            fs.writeFileSync(`${path}/../${fileName}_neck.png`, Utils.canvasCut(img, 350, 0, 190, 177).toBuffer());
            fs.writeFileSync(`${path}/../${fileName}_upper_left.png`, Utils.canvasCut(img, 350, 177, 190, 335).toBuffer());
            fs.writeFileSync(`${path}/../${fileName}_upper_right.png`, Utils.canvasCut(img, 540, 177, 190, 335).toBuffer());
            fs.writeFileSync(`${path}/../${fileName}_lower_left.png`, Utils.canvasCut(img, 730, 232, 147, 280).toBuffer());
            fs.writeFileSync(`${path}/../${fileName}_lower_right.png`, Utils.canvasCut(img, 877, 232, 147, 280).toBuffer());
        }


    }

    //fs.writeFileSync("./testAction.png", );
    process.exit();
}

start();