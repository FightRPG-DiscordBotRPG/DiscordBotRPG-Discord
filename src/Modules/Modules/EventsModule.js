const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const GameEvent = require("../../Drawings/Events/GameEvent");
const InteractContainer = require("../../Discord/InteractContainer");


class EventsModule extends GModule {
    constructor() {
        super();
        this.commands = ["showevent", "showongoingevents", "sevt", "sogevts"];
        this.startLoading("EventsModule");
        this.init();
        this.endLoading("EventsModule");
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

        switch (command) {
            case "showevent":
            case "sevt":
                msg = await this.getDisplayIfSuccess(
                    await axios.get("/game/events/show/" + args[0]),
                    async (data) => {
                        return new GameEvent(data.event).toEmbed(user);
                    }
                )
                break;
            case "showongoingevents":
            case "sogevts":
                msg = await this.getDisplayIfSuccess(
                    await axios.get("/game/events/ongoing"),
                    async (data) => {
                        //return new GameEvent(data.event).toEmbed(user);
                        data.events = Object.values(data.events);

                        if (data.events.length > 0) {
                            data.page = 1;
                            data.maxPage = data.events.length;
                            await this.pageListener(data, interact, new GameEvent(data.events[0]).toEmbed(user), async (currPage) => {
                                data.page = currPage;
                                return data;
                            }, async (newData) => {
                                console.log(newData);
                                return new GameEvent(newData.events[newData.page - 1]).toEmbed(user);
                            });
                        } else {
                            return Translator.getString(user.lang, "events", "no_events");
                        }
                    }
                )
                break;

        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = EventsModule;