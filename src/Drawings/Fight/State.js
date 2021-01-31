const Trait = require("./Trait");
const Translator = require("../../Translator/Translator");
const User = require("../../Users/User");

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

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    static toString(data, user) {
        return Translator.getString(user.lang, "stats", "1");
    }

    static types = {
        1: "element_attack",
        2: "state_attack",
        3: "stats_param",
        4: "element_rate",
        5: "stats_debuff",
        6: "state_debuff",
        7: "state_resist",
        8: "quiet_skill",
        9: "secondary_stats_debuff",
        10: "quiet_specific_skill",
        11: "secondary_stats",
    }

    static restrictions = {
       1:"cant_target_enemy",
       2:"cant_target_ally",
       3:"cant_target_self",
       4:"cant_target_do_anything",
    }

}


module.exports = State;