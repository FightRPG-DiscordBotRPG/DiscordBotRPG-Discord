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
        this.min = 0;
        this.max = 0;
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
     *
     * Return String : progress bar
     * @param {number} min
     * @param {number} max
     */
    draw(min = null, max = null) {
        this.prepareMinMax(min, max);

        if (this.min === 0 && this.max === 0) {
            this.max = 1;
        }
        if (this.min > this.max) {
            this.min = this.max;
        }
        let ratio = this.min / this.max;
        ratio = Math.round(ratio * this.size);
        return this.fill.repeat(ratio) + this.empty.repeat(this.size - ratio);
    }

    prepareMinMax(min = null, max = null) {
        this.min = min != null ? min : this.min;
        this.max = max != null ? max : this.max;
    }

}

module.exports = ProgressBar;