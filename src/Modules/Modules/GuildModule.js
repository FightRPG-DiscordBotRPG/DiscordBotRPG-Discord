const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Guild = require("../../Drawings/Guild");
const MessageReactionsWrapper = require("../../MessageReactionsWrapper");
const Emojis = require("../../Drawings/Emojis");
const InteractContainer = require("../../Discord/InteractContainer");

class GuildModule extends GModule {
    constructor() {
        super();
        this.commands = [
            "guild", "gcreate", "gdisband", "gapply", "gaccept", "gapplies", "gapplyremove", "gappliesremove", "guilds", "gremove", "gmod", "gannounce", "gaddmoney", "gremovemoney", "glevelup", "genroll", "gunenroll", "gleave", "gquit", "gkick", "gleaderswitch", "grename", "gterritories", "guildinfo", "guildcreate", "guilddisband", "guildapply", "guildaccept", "guildapplies", "guildapplyremove", "guildappliesremove", "guilduilds", "guildremove", "guildmod", "guildannounce", "guildaddmoney", "guildremovemoney", "guildlevelup", "guildenroll", "guildunenroll", "guildleave", "guildquit", "guildkick", "guildleaderswitch", "guildrename", "guildterritories", "guildlist"
        ];
        this.startLoading("Guild");
        this.init();
        this.endLoading("Guild");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let authorIdentifier = interact.author.id;
        /**
         * @type {MessageReactionsWrapper}
         */
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let lang = Globals.connectedUsers[interact.author.id].lang;

        switch (command) {
            case "guild":
            case "guildinfo":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/show"), (data) => {
                    return Guild.toString(data, Globals.connectedUsers[authorIdentifier]);
                });
                break;

            case "gterritories":
            case "guildterritories":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/territories"), (data) => {
                    return Guild.territoriesToString(data);
                });
                break;

            case "gcreate":
            case "guildcreate":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/create", {
                    guildName: args[0]
                }));
                break;

            case "gdisband":
            case "guilddisband":
                this.confirmListener(interact, Guild.disbandConfirm(lang), async (validate) => {
                    if (validate == true) {
                        return this.getBasicSuccessErrorMessage(await axios.post("/game/guild/disband"));
                    } else {
                        return Translator.getString(lang, "guild", "disband_cancelled");
                    }
                });
                break;


            case "gapply":
            case "guildapply":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/apply", {
                    idGuild: args[0]
                }));
                break;

            case "gaccept":
            case "guildaccept":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/accept", {
                    idCharacter: args[0]
                }));
                break;

            case "gapplies":
            case "guildapplies":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/applies/" + args[0]), async (data) => {
                    await this.pageListener(data, interact, Guild.appliancesToString(data, Globals.connectedUsers[authorIdentifier]), async (currPage) => {
                        let inData = await axios.get("/game/guild/applies/" + currPage);
                        return inData.data;
                    }, async (newData) => {
                        return Guild.appliancesToString(newData, Globals.connectedUsers[authorIdentifier]);
                    });
                });
                break;

            case "gapplyremove":
            case "guildapplyremove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/apply/cancel", {
                    id: args[0]
                }));
                break;

            case "gappliesremove":
            case "guildappliesremove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/applies/cancel"));
                break;

            case "guilds":
            case "guildlist":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/guild/list/" + args[0]), async (data) => {
                    await this.pageListener(data, interact, Guild.guildsToString(data, Globals.connectedUsers[authorIdentifier]), async (currPage) => {
                        let inData = await axios.get("/game/guild/list/" + currPage);
                        return inData.data;
                    }, async (newData) => {
                        return Guild.guildsToString(newData, Globals.connectedUsers[authorIdentifier]);
                    });
                });
                break;

            case "gremove":
            case "gkick":
            case "guildkick":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/kick/", {
                    id: args[0]
                }));
                break;

            case "gleave":
            case "gquit":
            case "guildleave":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/leave/"));
                break;

            case "gmod":
            case "guildmod":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/mod/", {
                    id: args[0],
                    rank: args[1]
                }));
                break;

            case "gleaderswitch":
            case "guildleaderswitch":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/mod/leaderswitch", {
                    id: args[0],
                }));
                break;


            case "gannounce":
            case "guildannounce":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/announce/", {
                    message: args[0],
                }));
                break;

            case "gaddmoney":
            case "guildaddmoney":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/money/add", {
                    money: args[0],
                }));
                break;

            case "gremovemoney":
            case "guildremovemoney":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/money/remove", {
                    money: args[0],
                }));
                break;


            case "glevelup":
            case "guildlevelup":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/levelup"));
                break;

            case "genroll":
            case "guildenroll":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/enroll"));
                break;

            case "gunenroll":
            case "guildunenroll":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/unenroll"));
                break;

            case "grename":
            case "guildrename":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/guild/rename", {
                    name: args[0],
                }));
                break;

        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = GuildModule;