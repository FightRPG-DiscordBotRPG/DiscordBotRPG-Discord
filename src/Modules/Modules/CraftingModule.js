const GModule = require("../GModule");
const conn = require("../../../conf/mysql");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Craft = require("../../Drawings/Craft");
const InteractContainer = require("../../Discord/InteractContainer");

class CraftingModule extends GModule {
    constructor() {
        super();
        this.commands = ["craftlist", "craftshow", "collect", "craftmake", "otherresources"];
        this.startLoading("Crafting");
        this.init();
        this.endLoading("Crafting");
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
            case "craftlist": {
                let searchFilters = this.getSearchFilters(args);
                msg = await this.getDisplayIfSuccess(await axios.get("/game/crafting/craftlist/" + searchFilters.page, {
                    params: searchFilters.params
                }), async (data) => {
                    await this.pageListener(data, interact, Craft.getCraftList(data), async (currPage) => {
                        let d = await axios.get("/game/crafting/craftlist/" + currPage, {
                            params: searchFilters.params
                        });
                        return d.data;
                    }, async (newData) => {
                        return Craft.getCraftList(newData);
                    });
                });
            }
                break;
            case "craftshow":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/crafting/craftshow/" + args[0]), (data) => {
                    return Craft.craftToEmbed(data);
                });
                break;

            case "craftmake":
                msg = await this.getDisplayIfSuccess(await axios.get("/game/crafting/craftshow/" + args[0]), async (data) => {
                    let craftMissing = Craft.craftToMissing(data);
                    if (craftMissing != null) {
                        return craftMissing;
                    } else {
                        return this.getBasicSuccessErrorMessage(await axios.post("/game/crafting/craft", {
                            idCraft: args[0],
                            level: args[1],
                            rebirthLevel: args[2],
                        }));
                    }
                });
                break;

            case "collect":
                msg = this.getBasicSuccessErrorMessage(await axios.post("/game/crafting/collect", {
                    idResource: args[0],
                    number: args[1]
                }));
                break;

            case "otherresources":
                msg = this.getBasicSuccessErrorMessage(await axios.get("/game/crafting/resources"));
                break;
        }
        this.sendMessage(interact, msg, command);
    }
}

module.exports = CraftingModule;