const GModule = require("../GModule");
const Shop = require("../../Drawings/Shop");
const Globals = require("../../Globals");


class ShopModule extends GModule {
    constructor() {
        super();
        this.commands = ["sitems", "sbuy", "shop"];
        this.startLoading("Shop");
        this.init();
        this.endLoading("Shop");
    }

    async run(message, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[message.author.id].getAxios();

        switch (command) {
            case "sitems":
            case "shop":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/shop/items/" + args[0]), async (data) => {
                    await this.pageListener(data, message, Shop.displayItems(data), async (currPage) => {
                        let d = await axios.get("/game/shop/items/" + currPage);
                        return d.data;
                    }, async (newData) => {
                        return Shop.displayItems(newData);
                    });
                });
                break;


            case "sbuy":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/shop/buy", {
                    idItem: args[0],
                    amount: args[1],
                }));
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = ShopModule;