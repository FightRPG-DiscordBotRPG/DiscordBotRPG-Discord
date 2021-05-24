const Discord = require("discord.js");
const Globals = require("../Globals");
const Translator = require("../Translator/Translator");

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
            toDisplay: "up_first",
            command: "up",
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
            toDisplay: "equip_first",
            command: "equip",
        },
        {
            toDisplay: "equiplist_first",
            command: "equiplist",
        },
        {
            toDisplay: "region_first",
            command: "equiplist",
        },
        {
            toDisplay: "travel_first",
            command: "travel",
        },
        {
            toDisplay: "travelregion_first",
            command: "travelregion",
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
     * @param {Discord.Message} message
     * @param {string} lang
     */
    async reactOnCommand(command, message, lang = "en") {
        console.log(command);
        console.log(this.currentStep);
        if (!this.hasStarted || this.currentStep.command !== command) {
            return;
        }

        try {
            await this.sendMessage(message, Translator.getString(lang, "tutorial", this.currentStep.toDisplay));

            if (!this.isLastStep()) {
                this.indexStep++;
                this.currentStep = this.nextStep;

                this.nextStep = Tutorial.Steps[this.indexStep];

                return;
            }

            // Is Last Step
            this.reset();
            await this.sendMessage(message, Translator.getString(lang, "tutorial", "end"));


        } catch (ex) {
            this.reset();
            console.log(ex);
        }
    }

    isLastStep() {
        return Tutorial.Steps.length === this.indexStep + 1;
    }

    /**
     * 
     * @param {Discord.Message} message
     */
    async start(message, lang = "en") {
        if (this.hasStarted) {
            return;
        }
        this.hasStarted = true;
        this.currentStep = Tutorial.Steps[0];
        this.nextStep = Tutorial.Steps[1];
        this.indexStep = 1;

        await this.sendMessage(message, Translator.getString(lang, "help_panel", "tutorial", [Globals.tutorialLink]));
        await this.sendMessage(message, Translator.getString(lang, "tutorial", "start"));
    }

    reset() {
        this.indexStep = 0;
        this.currentStep = null;
        this.nextStep = null;
        this.hasStarted = false;
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} content
     */
    async sendMessage(message, content) {
        try {
            await message.author.send(content);
        } catch {
            try {
                await message.channel.send(content);
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