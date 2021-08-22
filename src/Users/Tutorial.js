const Discord = require("discord.js");
const InteractContainer = require("../Discord/InteractContainer");
const Globals = require("../Globals");
const Translator = require("../Translator/Translator");
const Utils = require("../Utils");

class Tutorial {

    /**
     * @type TutorialStep[]
     */
    static Steps = [
        {
            toDisplay: "info_first",
            command: "info",
        },
        {
            toDisplay: "area_first",
            command: "area",
        },
        {
            toDisplay: "fight_first",
            command: "fight",
        },
        {
            toDisplay: "attributes_first",
            command: "attributes",
        },
        {
            toDisplay: "talents_first",
            command: "talents",
        },
        {
            toDisplay: "talentshow_first",
            command: "talentshow",
        },
        {
            toDisplay: "talentup_first",
            command: "talentup",
        },
        {
            toDisplay: "inventory_first",
            command: "inv",
        },
        {
            toDisplay: "item_first",
            command: "item",
        },
        {
            toDisplay: "equip_first",
            command: "equip",
        },
        {
            toDisplay: "equiplist_first",
            command: "equiplist",
        },
        {
            toDisplay: "region_first",
            command: "region",
        }
    ];

    constructor() {
        this.hasStarted = false;
        /**
         * @type {TutorialStep}
         **/
        this.nextStep = null;
        /**
         * @type {TutorialStep}
         **/
        this.currentStep = null;
        this.indexStep = 0;
    }

    /**
     * 
     * @param {string} command
     * @param {InteractContainer} interact
     * @param {string} lang
     */
    async reactOnCommand(command, interact, lang = "en") {
        if (!this.hasStarted || this.currentStep.command !== command) {
            return;
        }

        try {
            await this.sendMessage(interact, Translator.getString(lang, "tutorial", this.currentStep.toDisplay));

            if (!this.isLastStep()) {
                this.indexStep++;
                this.currentStep = this.nextStep;

                this.nextStep = Tutorial.Steps[this.indexStep];

                return;
            }

            // Is Last Step
            this.reset();
            await this.sendMessage(interact, Translator.getString(lang, "tutorial", "end"));


        } catch (ex) {
            this.reset();
            console.log(ex);
        }
    }

    isLastStep() {
        return Tutorial.Steps.length === this.indexStep;
    }

    /**
     * 
     * @param {InteractContainer} interact
     */
    async start(interact, lang = "en") {
        if (this.hasStarted) {
            return;
        }
        this.hasStarted = true;
        this.currentStep = Tutorial.Steps[0];
        this.nextStep = Tutorial.Steps[1];
        this.indexStep = 1;       
        await this.sendMessage(interact, Translator.getString(lang, "tutorial", "start"));
    }

    reset() {
        this.indexStep = 0;
        this.currentStep = null;
        this.nextStep = null;
        this.hasStarted = false;
    }

    /**
     * 
     * @param {InteractContainer} message
     * @param {string} content
     */
    async sendMessage(message, content) {
        let arrOfMessages = Utils.cutAtLineBreaksIfMoreThan(content, 2000);
        try {
            arrOfMessages.forEach(async (val) => await message.author.send(val));
        } catch {
            try {
                arrOfMessages.forEach(async (val) => await message.reply(val));
            } catch (e) {
                console.log(e);
            }
        }
    }
}

class TutorialStep {
    constructor() {
        this.toDisplay = "";
        this.command = "";
    }
}

module.exports = Tutorial;