'use strict';
const Emojis = require("../Emojis");
const Color = require("../Color");
class ProgressBar {
    fill = "█";
    empty = "░";
    size = 8;

    /**
     * 
     * @param {Color} color
     */
    constructor(color = Color.White) {
        this.setColor(color);
    }

    // Thanks to TBlazeWarriorT#5348  -  Nice idea
    /**
     * 
     * @param {Color} color
     */
    setColor(color=Color.White) {
        this.fill = Emojis.getString(`bar_${color}`);
        this.empty = Emojis.getString(`bar_${color}_empty`);
    }

    /**
     * 
     * @param {Number} size
     */
    setSize(size = 10) {
        this.size = size;
    }


    /**
     * Return String : progress bar
     * @param {Number} min     
     * @param {Number} max
     */
    draw(min, max) {
        if (min === 0 && max === 0) {
            max = 1;
        }
        if (min > max) {
            min = max;
        }
        let ratio = min / max;
        ratio = Math.round(ratio * this.size);
        return this.fill.repeat(ratio) + this.empty.repeat(this.size - ratio);
    }

}

module.exports = ProgressBar;