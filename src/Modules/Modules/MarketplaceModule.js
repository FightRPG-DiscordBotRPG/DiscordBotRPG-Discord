const GModule = require("../GModule");
const ItemShow = require("../../Drawings/ItemShow");
const Marketplace = require("../../Drawings/Marketplace");
const Globals = require("../../Globals");

class MarketplaceModule extends GModule {
    constructor() {
        super();
        this.commands = ["mkmylist", "mkplace", "mkcancel", "mkbuy", "mksearch", "mkshow", "mksee"];
        this.startLoading("Marketplace");
        this.init();
        this.endLoading("Marketplace");
    }

    async run(message, command, args) {
        let msg = "";
        let user = Globals.connectedUsers[message.author.id];
        let axios = user.getAxios();
        let searchFilters = this.getSearchFilters(args);
        switch (command) {
            case "mkmylist":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/mylist/" + args[0], { params: searchFilters.params }), async (data) => {
                    await this.pageListener(data, message, Marketplace.toString(data), async (currPage) => {
                        let d = await axios.get("/game/marketplace/mylist/" + currPage, { params: searchFilters.params });
                        return d.data;
                    }, async (newData) => {
                        return Marketplace.toString(newData)
                    });
                });
                break;

            case "mkplace":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/place", {
                    idItem: args[0],
                    number: args[1],
                    price: args[2],
                    forced: args[3],
                }));
                break;

            case "mkcancel":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/cancel", {
                    idItem: args[0]
                }));
                break;

            case "mkbuy":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/buy", {
                    idItem: args[0],
                    number: args[1],
                }));
                break;

            case "mksearch":
            case "mkshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/show/" + searchFilters.page, { params: searchFilters.params }), async (data) => {
                    await this.pageListener(data, message, Marketplace.toString(data), async (currPage) => {
                        let d = await axios.get("/game/marketplace/show/" + currPage, { params: searchFilters.params });
                        return d.data;
                    }, async (newData) => {
                        return Marketplace.toString(newData)
                    });
                });
                break;

            case "mksee":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/show/item/" + args[0]), (data) => {
                    return ItemShow.showItem(data, user);
                });
                break;
        }

        this.sendMessage(message, msg, command);
    }
}

module.exports = MarketplaceModule;