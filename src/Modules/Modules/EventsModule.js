const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const GameEvent = require("../../Drawings/Events/GameEvent");


class EventsModule extends GModule {
    constructor() {
        super();
        this.commands = ["showevent", "showongoingevents", "sevt", "sogevts"];
        this.startLoading("EventsModule");
        this.init();
        this.endLoading("EventsModule");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let mentions = message.mentions.users;
        let user = Globals.connectedUsers[message.author.id];
        let axios = user.getAxios();
        console.log(args[0]);
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
        }

        this.sendMessage(message, msg);
    }
}

module.exports = EventsModule;