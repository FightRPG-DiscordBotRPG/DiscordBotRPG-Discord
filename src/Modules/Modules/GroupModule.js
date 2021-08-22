const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const FightManager = require("../../Drawings/FightManager");
const Group = require("../../Drawings/Group");
const InteractContainer = require("../../Discord/InteractContainer");


class GroupModule extends GModule {
    constructor() {
        super();
        this.commands = [
            "grpmute", "grpunmute", "grpkick", "grpleave", "grpinvite", "grpaccept", "grpdecline", "grp", "grpfight", "grpswap",
            "groupmute", "groupunmute", "groupkick", "groupleave", "groupinvite", "groupaccept", "groupdecline", "groupinfo", "groupfight", "groupswap"
        ];
        this.startLoading("Group");
        this.init();
        this.endLoading("Group");
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
        let usernameToDoSomething = mentions?.first() != null ? mentions?.first().tag : args[0];

        switch (command) {
            case "grpmute":
            case "groupmute":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/notifications/mute"));
                break;

            case "grpunmute":
            case "groupunmute":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/notifications/unmute"));
                break;

            case "grpkick":
            case "groupkick":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/kick", {
                    username: usernameToDoSomething
                }));
                break;
            case "grpswap":
            case "groupswap":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/swap", {
                    username: usernameToDoSomething
                }));
                break;
            case "grpleave":
            case "groupleave":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/leave"));
                break;

            case "grpinvite":
            case "groupinvite":
                firstMention = mentions?.first();
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/invite", {
                    mention: firstMention != null ? firstMention.id : null
                }));
                break;

            case "grpaccept":
            case "groupaccept":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/accept"));
                break;

            case "grpdecline":
            case "groupdecline":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/group/decline"));
                break;

            case "grp":
            case "groupinfo":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/group/show"), (data) => {
                    return Group.toStr(data);
                });
                break;

            case "grpfight":
            case "groupfight":
                msg = await this.getDisplayIfSuccess(await axios.post("/game/group/fight/monster", {
                    idMonster: args[0]
                }), async (data) => {
                    await FightManager.fight(data, interact, Globals.connectedUsers[interact.author.id]);
                });
                break;
        }

        this.sendMessage(interact, msg, command);


    }
}

module.exports = GroupModule;