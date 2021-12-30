const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
//const PStatistics = require("../../Achievement/PStatistics");
const fightManager = require("../../Drawings/FightManager");
const InteractContainer = require("../../Discord/InteractContainer");
const { default: Collection } = require("@discordjs/collection");

class FightModule extends GModule {
    constructor() {
        super();
        this.commands = ["fight", "arena", "Fight in Arena"];
        this.startLoading("Fight");
        this.init();
        this.endLoading("Fight");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let mentions = interact.mentions;
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let firstMention;
        let user = Globals.connectedUsers[interact.author.id];

        //PStatistics.incrStat(Globals.connectedUsers[authorIdentifier].character.id, "commands_fights", 1);

        switch (command) {
            case "fight":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/fight/monster", {
                    idMonster: args[0],
                }), async (data) => {
                    await fightManager.fight(data, interact, user);
                    // For tutorial
                    await user.tutorial.reactOnCommand("fight", interact, user.lang);
                });
                break;

            case "arena":
            case "Fight in Arena":
                firstMention = mentions?.first();
                msg = await this.getDisplayIfSuccess(await axios.post("/game/fight/arena", {
                    idCharacter: args[0],
                    mention: firstMention != null ? firstMention.id : undefined
                }), async (data) => {
                    await fightManager.fight(data, interact, user);
                    // For tutorial
                    await user.tutorial.reactOnCommand("arena", interact, user.lang);
                });
        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = FightModule;