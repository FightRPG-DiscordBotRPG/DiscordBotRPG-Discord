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
        let authorIdentifier = message.author.id;
        let mentions = message.mentions.users;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;
        let firstMention;

        //PStatistics.incrStat(Globals.connectedUsers[authorIdentifier].character.id, "commands_fights", 1);

        switch (command) {
            case "fight":
                data = await axios.post("/game/fight/monster", {
                    idMonster: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    await fightManager.fight(data, message);
                } else {
                    msg = data.error;
                }
                break;


            case "arena":
                firstMention = mentions.first();
                data = await axios.post("/game/fight/arena", {
                    idCharacter: args[0],
                    mention: firstMention != null ? firstMention.id : undefined
                });
                data = data.data;
                if (data.error == null) {
                    await fightManager.fight(data, message);
                } else {
                    msg = data.error;
                }
        }

        this.sendMessage(message, msg);
    }
}

module.exports = FightModule;