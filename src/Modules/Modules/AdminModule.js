const GModule = require("../GModule");
const conn = require("../../../conf/mysql");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");
const Utils = require("../../Utils");
const Emojis = require("../../Drawings/Emojis");
const GenericMultipleEmbedList = require("../../Drawings/GenericMultipleEmbedList");
const InteractContainer = require("../../Discord/InteractContainer");

class AdminModule extends GModule {
    constructor() {
        super();
        this.commands = ["updatepresence", "giveme", "active", "mutefor", "xp", "gold", "resetfight", "reload_translations", "reload_emojis", "ldadmin", "reload_leaderboard", "debug", "last_command", "giveto", "active_players", "update_commands_channel", "bot_info", "eval", "show_all_emojis", "updateslashcommands"];
        this.startLoading("Admin");
        this.init();
        this.endLoading("Admin");
    }

    /**
     * 
     * @param {InteractContainer} interact
     * @param {any} command
     * @param {any} args
     */
    async run(interact, command, args) {
        let isAdmin = Globals.admins.indexOf(interact.author.id) > -1;
        let msg = "";
        let authorIdentifier = interact.author.id;
        let axios = Globals.connectedUsers[interact.author.id].getAxios();
        let data;
        let evalDyn;
        if (!isAdmin) return;

        switch (command) {
            case "updatepresence":
                try {
                    await interact.client.user.setPresence({
                        activity: {
                            name: "On " + await Utils.getTotalNumberOfGuilds(interact.client.shard) + " servers!"
                        }
                    });
                    msg = "Présence mise à jour.";
                } catch (e) {
                    msg = e;
                }
                break;

            case "updateslashcommands": {
                await interact.client.application?.fetch();
                console.log(Globals.commands);
                const cmds = await interact.client.application?.commands.set(Globals.commands);
                console.log(cmds);
            } break;

            case "giveme":
                data = await axios.post("/game/admin/give/item/me", {
                    idItem: args[0],
                    number: args[1],
                    rebirthLevel: args[2],
                });
                data = data.data;
                if (data.error != null) {
                    msg = data.error;
                } else {
                    msg = data.success;
                }
                break;

            case "giveto":
                data = await axios.post("/game/admin/give/item/to", {
                    idUser: args[0],
                    idItem: args[1],
                    level: args[2],
                    number: args[3],
                });
                data = data.data;
                if (data.error != null) {
                    msg = data.error;
                } else {
                    msg = data.success;
                }
                break;

            case "active_players":
                data = await axios.get("/game/admin/active_players/" + args[0]);
                data = data.data;
                if (data.error == null) {

                    let hours = Object.keys(data.hourlyActivePlayers).length;
                    let values = "Joueurs actifs ces " + hours + " dernières heures.\n";
                    let it = hours - 1;
                    let avg = 0;
                    for (let i in data.hourlyActivePlayers) {
                        values += i + ": " + data.hourlyActivePlayers[i] + (it <= 0 ? "" : " - ");
                        avg += data.hourlyActivePlayers[i];
                        it--;
                    }

                    values += "\n\n" + "Moyenne sur ces " + hours + " dernières heures : " + Math.round(avg / hours) + ".";
                    values += "\n\n" + "Utilisateurs uniques depuis ces " + hours + " dernières heures : " + data.uniqueUsers + ".";
                    msg = values;
                } else {
                    msg = data.error;
                }


                break;

            case "active":
                data = await axios.post("/game/admin/bot/activate", {
                    active: args[0],
                    reason: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "mutefor":
                data = await axios.post("/game/admin/user/mute", {
                    idUser: args[0],
                    time: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "xp":
                data = await axios.post("/game/admin/give/xp", {
                    xp: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "gold":
                data = await axios.post("/game/admin/give/gold", {
                    amount: args[0],
                    idUser: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "resetfight":
                data = await axios.post("/game/admin/resetfight");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "reload_translations":
                data = await axios.post("/game/admin/translations/reload");
                data = data.data;
                if (data.error == null) {
                    Translator.translations = {};
                    Translator.nbOfTranslations = 0;
                    Translator.formaters = {};
                    await Translator.loadFromJson();
                    Translator.loadFormaters();
                    msg = "Local Translations reloaded\n";
                    msg += data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "debug":
                await axios.get("/game/admin/debug", {
                    params: {
                        p1: args[0],
                        p2: args[1]
                    }
                });
                msg = "Success"
                break;
            case "last_command":
                data = await axios.get("/game/admin/last_command");
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
            case "show_all_emojis": {
                let emojis = [];
                let page = args[0] > 0 ? args[0] : 1;
                let perPage = 10;

                for (let emojiName in Emojis.general) {
                    emojis.push(emojiName + ": " + Emojis.general[emojiName]);
                }

                for (let emojiName in Emojis.emojisProd) {
                    emojis.push(emojiName + ": " + Emojis.emojisProd[emojiName].string);
                }

                let maxPage = Math.ceil(emojis.length / perPage);
                let genericList = new GenericMultipleEmbedList();
                genericList.load({ collection: emojis.slice(perPage * (page - 1), perPage * page), listType: 0, pageRelated: { page: page, maxPage: maxPage } }, "en", (i, str) => str);


                await this.pageListener({ page: page, maxPage: maxPage }, interact, genericList.getEmbed(new Discord.MessageEmbed().setAuthor("Emojis").setTitle("All Bot Emojis")), async (currPage) => {
                    genericList.load({ collection: emojis.slice(perPage * (currPage - 1), perPage * currPage), listType: 0, pageRelated: { page: currPage, maxPage: maxPage } }, "en", (i, str) => str);
                    return { page: currPage, maxPage: maxPage, text: genericList.getEmbed(new Discord.MessageEmbed().setAuthor("Emojis").setTitle("All Bot Emojis")) }
                }, async (newData) => {
                    return newData.text;
                });

            }
                break;
            case "warn":
                args[0] = decodeURIComponent(args[0]);
                for (let idUser of args[0].split(",")) {
                    evalDyn = (client) => {
                        let user = client.users.cache.get(idUser);
                        if (user != null) {
                            user.send("Due to using macros, you got warned. Your FightRPG account got it's money set to zero. This is the last warning you'll get. Next punishment will result in a full reset instead.").catch((e) => { null });
                        }
                    }
                    interact.client.shard.broadcastEval(evalDyn);
                }
                msg = "Done";
                break;
            case "eval":
                if (interact.author.id !== Globals.ownerID) break;
                try {
                    const code = args.join(" ");
                    let evaled = eval(`(async () => {${decodeURIComponent(code)}})()`);
                    if (typeof evaled !== "string") {
                        evaled = require("util").inspect(await evaled);
                    }

                    msg = Utils.clean(evaled);
                } catch (err) {
                    msg = `\`ERROR\` \`\`\`xl\n${Utils.clean(err)}\n\`\`\``;
                }

                msg = msg.length > 2000 ? msg.substring(0, 2000) : msg;
                break;
            case "update_commands_channel": {
                let actualMessages = await interact.channel.messages.fetch({
                    limit: 20
                });

                let deleting = [];
                for (let actumsg of actualMessages) {
                    deleting.push(actumsg[1].delete());
                }
                await Promise.all(deleting);
                data = Utils.getHelpPanel("en", 1);
                let maxPage = data.maxPage;
                if (data.error == null) {
                    await interact.channel.send(this.cmdToString(data)).catch(e => null);
                }
                for (let i = 2; i <= maxPage; i++) {
                    data = Utils.getHelpPanel("en", i);
                    if (data.error == null) {
                        await interact.channel.send(this.cmdToString(data)).catch(e => null);
                    }
                }
                break;
            }
        }

        this.sendMessage(interact, msg);
    }
}

module.exports = AdminModule;