const GModule = require("../GModule");
const Discord = require("discord.js");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const ItemShow = require("../../Drawings/ItemShow");
const Trade = require("../../Drawings/Trade");
const InteractContainer = require("../../Discord/InteractContainer");

class TradeModule extends GModule {
    constructor() {
        super();
        this.commands = ["tradepropose", "tradecancel", "tradeaccept", "tradeshow", "tradeitem", "tradeadd", "traderemove", "tradesetmoney", "tradevalidate", "Propose a Trade"];
        this.startLoading("Trade");
        this.init();
        this.endLoading("Trade");
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
        let mentions = interact.mentions;
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let user = Globals.connectedUsers[interact.author.id];
        let firstMention = mentions?.first();

        switch (command) {
            case "tradepropose":
            case "Propose a Trade":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/propose", {
                    mention: firstMention != null ? firstMention.id : null
                }));
                break;

            case "tradeaccept":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/accept"));
                break;

            case "tradecancel":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/cancel"));
                break;

            case "tradeadd":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/item/add", {
                    idEmplacement: args[0],
                    number: args[1],
                }));
                break;

            case "traderemove":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/item/remove", {
                    idEmplacement: args[0],
                    number: args[1],
                }));
                break;

            case "tradevalidate":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/validate"));
                break;

            case "tradesetmoney":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/trade/money/set", {
                    number: args[0],
                }));
                break;

            case "tradeshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/trade/show"), (data) => {
                    this.confirmListener(interact, Trade.toString(data, Globals.connectedUsers[authorIdentifier]), async (validate) => {
                        if (validate) {
                            this.run(interact, "tradevalidate", args);
                        } else {
                            this.run(interact, "tradecancel", args);
                        }
                    }, user.lang);
                });
                break;

            case "tradeitem":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/trade/item/show/" + args[0]), (data) => {
                    return ItemShow.showItem(data, user);
                });
                break;

        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = TradeModule;