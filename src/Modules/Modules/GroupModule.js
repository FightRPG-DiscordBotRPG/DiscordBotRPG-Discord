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
        let authorIdentifier = message.author.id;
        let mentions = message.mentions.users;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;
        let firstMention;
        let usernameToDoSomething = mentions.first() != null ? mentions.first().username + mentions.first().tag : args[0];


        switch (command) {
            case "grpmute":
                data = await axios.post("/game/group/notifications/mute");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grpunmute":
                data = await axios.post("/game/group/notifications/unmute");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grpkick":
                data = await axios.post("/game/group/kick", {
                    username: usernameToDoSomething
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "grpswap":
                data = await axios.post("/game/group/swap", {
                    username: usernameToDoSomething
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "grpleave":
                data = await axios.post("/game/group/leave");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grpinvite":
                firstMention = mentions.first();
                data = await axios.post("/game/group/invite", {
                    mention: firstMention != null ? firstMention.id : null
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grpaccept":
                data = await axios.post("/game/group/accept");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grpdecline":
                data = await axios.post("/game/group/decline");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "grp":
                data = await axios.get("/game/group/show");
                data = data.data;
                if (data.error == null) {
                    msg = Group.toStr(data);
                } else {
                    msg = data.error;
                }
                break;

            case "grpfight":
                data = await axios.post("/game/group/fight/monster", {
                    idMonster: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = FightManager.fightPvE(data, message);
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);


    }
}

module.exports = GroupModule;