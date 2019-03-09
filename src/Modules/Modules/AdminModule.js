const GModule = require("../GModule");
const conn = require("../../../conf/mysql");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Discord = require("discord.js");

class AdminModule extends GModule {
    constructor() {
        super();
        this.commands = ["updatepresence", "giveme", "active", "mutefor", "xp", "gold", "resetfight", "reload_translations", "reload_emojis", "ldadmin", "reload_leaderboard", "debug", "last_command", "giveto", "active_players", "update_commands_channel", "bot_info"];
        this.startLoading("Admin");
        this.init();
        this.endLoading("Admin");
    }

    async run(message, command, args) {
        let isAdmin = Globals.admins.indexOf(message.author.id) > -1;
        let msg = "";
        let authorIdentifier = message.author.id;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;
        if (!isAdmin) return;

        switch (command) {
            case "updatepresence":
                try {
                    await message.client.user.setPresence({
                        game: {
                            name: "On " + message.client.guilds.size + " guilds !",
                        },
                    });
                    msg = "Présence mise à jour.";
                } catch (e) {
                    msg = e;
                }
                break;

            case "giveme":
                data = await axios.post("/game/admin/give/item/me", {
                    idItem: args[0],
                    number: args[1],
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
                //msg = Globals.connectedUsers[authorIdentifier].character.getInv().getIdItemOfThisEmplacement(args[0]);
                /*let pb = require("../../ProgressBar");
                let progress = new pb();
                msg = progress.draw(0, 0);*/
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
            case "update_commands_channel":
                let actualMessages = await message.channel.fetchMessages({
                    limit: 20
                });

                let deleting = [];
                for (let actumsg of actualMessages) {
                    deleting.push(actumsg[1].delete());
                }
                await Promise.all(deleting);
                data = await axios.get("/game/other/help/1");
                data = data.data;
                let maxPage = data.maxPage;
                if (data.error == null) {
                    await message.channel.send(this.cmdToString(data)).catch(e => null);
                }
                for (let i = 2; i <= maxPage; i++) {
                    data = await axios.get("/game/other/help/" + i);
                    data = data.data;
                    if (data.error == null) {
                        await message.channel.send(this.cmdToString(data)).catch(e => null);
                    }
                }
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = AdminModule;