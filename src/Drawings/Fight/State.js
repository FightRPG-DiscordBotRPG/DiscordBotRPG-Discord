const Trait = require("./Trait");

class State {

    constructor() {
        this.id = 0;
        this.name = "";

        this.afterFight = false;
        this.afterDamage = false;
        this.afterRounds = false;
        /**
         * @type {Array<Trait>}
         */
        this.traits = [];
        this.roundsLeft = 0;

    }

}


module.exports = State;