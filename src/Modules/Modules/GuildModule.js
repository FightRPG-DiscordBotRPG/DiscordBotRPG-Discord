const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Guild = require("../../Drawings/Guild");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Emojis = require("../../Drawings/Emojis");

class GuildModule extends GModule {
    constructor() {
        super();
        this.commands = ["guild", "gcreate", "gdisband", "gapply", "gaccept", "gapplies", "gapplyremove", "gappliesremove", "guilds", "gremove", "gmod", "gannounce", "gaddmoney", "gremovemoney", "glevelup", "genroll", "gunenroll", "gleave", "gquit", "gkick", "gleaderswitch", "grename", "gterritories"];
        this.startLoading("Guild");
        this.init();
        this.endLoading("Guild");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        /**
         * @type {MessageReactionsWrapper}
         */
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let lang = Globals.connectedUsers[message.author.id].lang;

        switch (command) {
            case "guild":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/show"), (data) => {
                    return Guild.toString(data, Globals.connectedUsers[authorIdentifier]);
                });
                break;

            case "gterritories":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/territories"), (data) => {
                    return Guild.territoriesToString(data);
                });
                break;

            case "gcreate":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/create", {
                    guildName: args[0]
                }));
                break;

            case "gdisband":
                this.confirmListener(message, Guild.disbandConfirm(lang), async (validate) => {
                    if (validate == true) {
                        return this.getBasicSuccessErrorMessage(await axios.post("/game/guild/disband"));
                    } else {
                        return Translator.getString(lang, "guild", "disband_cancelled");
                    }
                });
                break;


            case "gapply":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/apply", {
                    idGuild: args[0]
                }));
                break;

            case "gaccept":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/accept", {
                    idCharacter: args[0]
                }));
                break;

            case "gapplies":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/applies/" + args[0]), async (data) => {
                    await this.pageListener(data, message, Guild.appliancesToString(data, Globals.connectedUsers[authorIdentifier]), async (currPage) => {
                        let inData = await axios.get("/game/guild/applies/" + currPage);
                        return inData.data;
                    }, async (newData) => {
                        return Guild.appliancesToString(newData, Globals.connectedUsers[authorIdentifier]);
                    });
                });
                break;

            case "gapplyremove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/apply/cancel", {
                    id: args[0]
                }));
                break;

            case "gappliesremove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/applies/cancel"));
                break;

            case "guilds":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/list/" + args[0]), async (data) => {
                    await this.pageListener(data, message, Guild.guildsToString(data, Globals.connectedUsers[authorIdentifier]), async (currPage) => {
                        let inData = await axios.get("/game/guild/list/" + currPage);
                        return inData.data;
                    }, async (newData) => {
                        return Guild.guildsToString(newData, Globals.connectedUsers[authorIdentifier]);
                    });
                });
                break;

            case "gremove":
            case "gkick":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/kick/", {
                    id: args[0]
                }));
                break;

            case "gleave":
            case "gquit":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/leave/"));
                break;

            case "gmod":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/mod/", {
                    id: args[0],
                    rank: args[1]
                }));
                break;

            case "gleaderswitch":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/mod/leaderswitch", {
                    id: args[0],
                }));
                break;


            case "gannounce":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/announce/", {
                    message: args[0],
                }));
                break;

            case "gaddmoney":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/money/add", {
                    money: args[0],
                }));
                break;

            case "gremovemoney":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/money/remove", {
                    money: args[0],
                }));
                break;


            case "glevelup":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/levelup"));
                break;

            case "genroll":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/enroll"));
                break;

            case "gunenroll":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/unenroll"));
                break;

            case "grename":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/rename", {
                    name: args[0],
                }));
                break;

        }

        this.sendMessage(message, msg);
    }
}

module.exports = GuildModule;