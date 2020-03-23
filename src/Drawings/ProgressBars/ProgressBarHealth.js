const ProgressBar = require("./ProgressBar");
const Color = require("../Color");

class ProgressBarHealth extends ProgressBar {

    constructor(color = Color.White) {
        super(color);
        this.size = 12;
    }

    draw(min, max) {
        let ratio = min / max;
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