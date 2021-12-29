const GModule = require("../GModule");
const ItemShow = require("../../Drawings/ItemShow");
const Marketplace = require("../../Drawings/Marketplace");
const Globals = require("../../Globals");
const InteractContainer = require("../../Discord/InteractContainer");

class MarketplaceModule extends GModule {
    constructor() {
        super();
        this.commands = ["marketplacemylist", "marketplaceplace", "marketplacecancel", "marketplacebuy", "marketplacesearch", "marketplacesee"
        ];
        this.startLoading("Marketplace");
        this.init();
        this.endLoading("Marketplace");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let user = Globals.connectedUsers[interact.author.id];
        let axios = user.getAxios();
        let searchFilters = this.getSearchFilters(args);
        switch (command) {
            case "marketplacemylist":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/mylist/" + args[0], { params: searchFilters.params }), async (data) => {
                    await this.pageListener(data, interact, Marketplace.toString(data), async (currPage) => {
                        let d = await axios.get("/game/marketplace/mylist/" + currPage, { params: searchFilters.params });
                        return d.data;
                    }, async (newData) => {
                        return Marketplace.toString(newData)
                    });
                });
                break;

            case "marketplaceplace":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/place", {
                    idItem: args[0],
                    number: args[1],
                    price: args[2],
                    forced: args[3],
                }));
                break;

            case "marketplacecancel":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/cancel", {
                    idItem: args[0]
                }));
                break;

            case "marketplacebuy":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/marketplace/buy", {
                    idItem: args[0],
                    number: args[1],
                }));
                break;

            case "marketplacesearch":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/show/" + searchFilters.page, { params: searchFilters.params }), async (data) => {
                    await this.pageListener(data, interact, Marketplace.toString(data), async (currPage) => {
                        let d = await axios.get("/game/marketplace/show/" + currPage, { params: searchFilters.params });
                        return d.data;
                    }, async (newData) => {
                        return Marketplace.toString(newData)
                    });
                });
                break;

            case "marketplacesee":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/marketplace/show/item/" + args[0]), (data) => {
                    return ItemShow.showItem(data, user);
                });
                break;
        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = MarketplaceModule;