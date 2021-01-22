const ProgressBar = require("./ProgressBar");
const Color = require("../Color");

class ProgressBarHealth extends ProgressBar {

    constructor(color = Color.White) {
        super(color);
        this.size = 12;
    }

    /**
     * 
     * @param {number} min
     * @param {number} max
     */
    draw(min = null, max = null) {
        this.prepareMinMax(min, max);

        let ratio = this.min / this.max;
        if (ratio > 0.66) {
            this.setColor(Color.Green);
        } else if (ratio <= 0.66 && ratio > 0.33) {
            this.setColor(Color.Yellow);
        } else {
            this.setColor(Color.Red);
        }

        return super.draw(min, max);
    }
}

module.exports = ProgressBarHealth;