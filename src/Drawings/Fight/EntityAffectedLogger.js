const DamageAndHealLogger = require("./DamageAndHealLogger");
const State = require("./State");

class EntityAffectedLogger {
    constructor() {

        this.entity = {
            identity: {
                name: "",
                type: "",
                uuid: "",
                monsterType: null,
                monsterDifficultyName: null,
            },
            actualHP: 0,
            maxHP: 0,
            actualMP: 0,
            maxMP: 0,
            actualEnergy: 0,
            maxEnergy: 0,
            level: 0,
            states: {}
        };

        this.battle = {
            /**
             * @type {Array<State>}
             */
            removedStates: [],
            /**
             * @type {Array<State>}
             */
            addedStates: [],
            /**
             * @type {DamageAndHealLogger}
             */
            statesResults: {},
            /**
             * @type {DamageAndHealLogger}
             */
            skillResults: {},
            isCritical: false,
        };

    }

}

module.exports = EntityAffectedLogger;