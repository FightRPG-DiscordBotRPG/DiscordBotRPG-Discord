const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Guild = require("../../Drawings/Guild");

class GuildModule extends GModule {
    constructor() {
        super();
        this.commands = ["guild", "gcreate", "gdisband", "gapply", "gaccept", "gapplies", "gapplyremove", "gappliesremove", "guilds", "gremove", "gmod", "gannounce", "gaddmoney", "gremovemoney", "glevelup", "genroll", "gunenroll", "gleave", "gquit", "gkick", "gleaderswitch"];
        this.startLoading("Guild");
        this.init();
        this.endLoading("Guild");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "guild":
                data = await axios.get("/game/guild/show");
                data = data.data;
                if (data.error == null) {
                    msg = Guild.toString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "gcreate":
                data = await axios.post("/game/guild/create", {
                    guildName: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gdisband":
                data = await axios.post("/game/guild/disband");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;


            case "gapply":
                data = await axios.post("/game/guild/apply", {
                    idGuild: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gaccept":
                data = await axios.post("/game/guild/accept", {
                    idCharacter: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gapplies":
                data = await axios.get("/game/guild/applies/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Guild.appliancesToString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "gapplyremove":
                data = await axios.post("/game/guild/apply/cancel", {
                    id: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gappliesremove":
                data = await axios.post("/game/guild/applies/cancel");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "guilds":
                data = await axios.get("/game/guild/list/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = Guild.guildsToString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "gremove":
            case "gkick":
                data = await axios.post("/game/guild/kick/", {
                    id: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gleave":
            case "gquit":
                data = await axios.post("/game/guild/leave/");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gmod":
                data = await axios.post("/game/guild/mod/", {
                    id: args[0],
                    rank: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gleaderswitch":
                data = await axios.post("/game/guild/mod/leaderswitch", {
                    id: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;


            case "gannounce":
                data = await axios.post("/game/guild/announce/", {
                    message: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gaddmoney":
                data = await axios.post("/game/guild/money/add", {
                    money: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gremovemoney":
                data = await axios.post("/game/guild/money/remove", {
                    money: args[0],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;


            case "glevelup":
                data = await axios.post("/game/guild/levelup");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "genroll":
                data = await axios.post("/game/guild/enroll");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gunenroll":
                data = await axios.post("/game/guild/unenroll");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

        }

        this.sendMessage(message, msg);
    }
}

module.exports = GuildModule;