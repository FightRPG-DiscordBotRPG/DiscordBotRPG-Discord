const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
//const PStatistics = require("../../Achievement/PStatistics");
const fightManager = require("../../Drawings/FightManager");

class FightModule extends GModule {
    constructor() {
        super();
        this.commands = ["fight", "arena"];
        this.startLoading("Fight");
        this.init();
        this.endLoading("Fight");
    }

    async run(message, command, args) {
        let msg = "";
        let mentions = message.mentions.users;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let firstMention;
        let user = Globals.connectedUsers[message.author.id];

        //PStatistics.incrStat(Globals.connectedUsers[authorIdentifier].character.id, "commands_fights", 1);

        switch (command) {
            case "fight":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/fight/monster", {
                    idMonster: args[0],
                }), async (data) => {
                    await fightManager.fight(data, message, user);
                    // For tutorial
                    await user.tutorial.reactOnCommand("fight", message, user.lang);
                });
                break;

            case "arena":
                firstMention = mentions.first();
                msg = await this.getDisplayIfSuccess(await axios.post("/game/fight/arena", {
                    idCharacter: args[0],
                    mention: firstMention != null ? firstMention.id : undefined
                }), async (data) => {
                    await fightManager.fight(data, message, user);
                    // For tutorial
                    await user.tutorial.reactOnCommand("arena", message, user.lang);
                });
        }

        this.sendMessage(message, msg, command);
    }
}

module.exports = FightModule;