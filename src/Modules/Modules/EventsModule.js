const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const GameEvent = require("../../Drawings/Events/GameEvent");
const InteractContainer = require("../../Discord/InteractContainer");


class EventsModule extends GModule {
    constructor() {
        super();
        this.commands = ["eventsshow", "eventsongoing", "eventsincoming"];
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
            case "eventsshow":
                msg = await this.getDisplayIfSuccess(
                    await axios.get("/game/events/show/" + args[0]),
                    async (data) => {
                        return new GameEvent(data.event).toEmbed(user);
                    }
                )
                break;
            case "eventsongoing":
                msg = await this.getDisplayIfSuccess(
                    await axios.get("/game/events/ongoing"),
                    async (data) => {
                        //return new GameEvent(data.event).toEmbed(user);
                        data.events = Object.values(data.events);
                        return this.eventsToEmbed(data, interact, user);
                    }
                )
                break;
            case "eventsincoming":
                msg = await this.getDisplayIfSuccess(
                    await axios.get("/game/events/incoming/" + args[0]),
                    async (data) => {
                        // Add to discord events
                        if (interact.channel.guild.ownerId == interact.author.id && args[1] == "true") {
                            const arrOfEventsToBeCreated = [];
                            const guild = interact.channel.guild;
                            const guildEvents = await guild.scheduledEvents.fetch({ cache: false })

                            for (let event of data.events) {
                                let shouldCreate = true;
                                const title = event.title + " (ID: " + event.id + ")";
                                for (let guildEvent of guildEvents.values()) {
                                    if (guildEvent.creatorId == interact.client.user.id && guildEvent.name == title) {
                                        shouldCreate = false;
                                        break;
                                    }
                                }

                                if (!shouldCreate) {
                                    break;
                                }

                                const gEvent = new GameEvent(event);

                                // Create an event
                                arrOfEventsToBeCreated.push(guild.scheduledEvents.create({
                                    name: title,
                                    description: gEvent.desc,
                                    privacyLevel: "GUILD_ONLY",
                                    reason: "Event created by " + interact.client.user.username,
                                    scheduledStartTime: gEvent.startDate.toDate(),
                                    scheduledEndTime: gEvent.endDate.toDate(),
                                    entityType: "EXTERNAL",
                                    entityMetadata: {
                                        location: interact.client.user.username,
                                    }

                                }));
                            }

                            await interact.interaction.deferReply();
                            await Promise.all(arrOfEventsToBeCreated);

                            return Translator.getString(user.lang, "events", "events_created");
                        } else {
                            return this.eventsToEmbed(data, interact, user);
                        }

                    }
                )

        }

        this.sendMessage(interact, msg, command);
    }

    async eventsToEmbed(data, interact, user) {
        if (data.events.length > 0) {
            data.page = 1;
            data.maxPage = data.events.length;
            await this.pageListener(data, interact, new GameEvent(data.events[0]).toEmbed(user), async (currPage) => {
                data.page = currPage;
                return data;
            }, async (newData) => {
                return new GameEvent(newData.events[newData.page - 1]).toEmbed(user);
            });
        } else {
            return Translator.getString(user.lang, "events", "no_events");
        }

    }
}

module.exports = EventsModule;