const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const FightManager = require("../../Drawings/FightManager");
const Group = require("../../Drawings/Group");


class GroupModule extends GModule {
    constructor() {
        super();
        this.commands = ["grpmute", "grpunmute", "grpkick", "grpleave", "grpinvite", "grpaccept", "grpdecline", "grp", "grpfight", "grpswap"];
        this.startLoading("Group");
        this.init();
        this.endLoading("Group");
    }

    async run(message, command, args) {
        let msg = "";
        let mentions = message.mentions.users;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let firstMention;
        let usernameToDoSomething = mentions.first() != null ? mentions.first().tag : args[0];

        switch (command) {
            case "grpmute":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/notifications/mute"));
                break;

            case "grpunmute":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/notifications/unmute"));
                break;

            case "grpkick":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/kick", {
                    username: usernameToDoSomething
                }));
                break;
            case "grpswap":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/swap", {
                    username: usernameToDoSomething
                }));
                break;
            case "grpleave":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/leave"));
                break;

            case "grpinvite":
                firstMention = mentions.first();
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/invite", {
                    mention: firstMention != null ? firstMention.id : null
                }));
                break;

            case "grpaccept":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/accept"));
                break;

            case "grpdecline":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/decline"));
                break;

            case "grp":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/group/show"), (data) => {
                    return Group.toStr(data);
                });
                break;

            case "grpfight":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/group/fight/monster", {
                    idMonster: args[0]
                }), async (data) => {
                    await FightManager.fight(data, message, Globals.connectedUsers[message.author.id]);
                });
                break;
        }

        this.sendMessage(message, msg);


    }
}

module.exports = GroupModule;