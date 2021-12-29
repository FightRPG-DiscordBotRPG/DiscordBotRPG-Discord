const GModule = require("../GModule");
const Shop = require("../../Drawings/Shop");
const Globals = require("../../Globals");
const InteractContainer = require("../../Discord/InteractContainer");


class ShopModule extends GModule {
    constructor() {
        super();
        this.commands = ["shoplist", "shopbuy"];
        this.startLoading("Shop");
        this.init();
        this.endLoading("Shop");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[interact.author.id].getAxios();

        switch (command) {
            case "shoplist":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/shop/items/" + args[0]), async (data) => {
                    await this.pageListener(data, interact, Shop.displayItems(data), async (currPage) => {
                        let d = await axios.get("/game/shop/items/" + currPage);
                        return d.data;
                    }, async (newData) => {
                        return Shop.displayItems(newData);
                    });
                });
                break;

            case "shopbuy":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/shop/buy", {
                    idItem: args[0],
                    amount: args[1],
                }));
                break;
        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = ShopModule;