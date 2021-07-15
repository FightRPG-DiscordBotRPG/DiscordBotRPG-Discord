const fs = require("fs");
const Canvas = require("canvas");
const Utils = require("../src/Utils");

async function start() {

    let path = "W:\\DocumentsWndows\\FightRPG\\character\\Fantasy\\Gloves\\bases";

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

        fs.writeFileSync(`${path}/../${fileName}_wrist_left.png`, Utils.canvasCut(img, 0, 0, 170, 299).toBuffer());

        fs.writeFileSync(`${path}/../${fileName}_wrist_right.png`, Utils.canvasCut(img, 171, 0, 170, 299).toBuffer());


        fs.writeFileSync(`${path}/../${fileName}_hand_left.png`, Utils.canvasCut(img, 0, 301, 170, 210).toBuffer());

        fs.writeFileSync(`${path}/../${fileName}_hand_right.png`, Utils.canvasCut(img, 171, 301, 170, 210).toBuffer());
    }

    //fs.writeFileSync("./testAction.png", );
    process.exit();
}

start();