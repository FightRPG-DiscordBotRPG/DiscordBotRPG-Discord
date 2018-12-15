const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const Emojis = require("../../Drawings/Emojis");
const ProgressBar = require("../../Drawings/ProgressBar");
const TextDrawing = require("../../Drawings/TextDrawings");
const Leaderboard = require("../../Drawings/Leaderboard");

class CharacterModule extends GModule {
    constructor() {
        super();
        this.commands = ["reset", "leaderboard", "info", "up"];
        this.startLoading("Character");
        this.init();
        this.endLoading("Character");

        this.authorizedAttributes = ["str", "int", "con", "dex", "cha", "will", "luck", "wis", "per"];
    }

    async run(message, command, args) {
        let msg = "";
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;

        //PStatistics.incrStat(Globals.connectedUsers[authorIdentifier].character.id, "commands_character", 1);

        switch (command) {

            case "reset":
                data = await axios.get("/game/character/reset");
                data = data.data;
                if (data.error != null) {
                    msg = data.error;
                } else {
                    msg = data.success;
                }
                break;

            case "leaderboard":
                data = await axios.get("/game/character/leaderboard");
                data = data.data;
                msg = data.error != null ? data.error : Leaderboard.leaderboardToString(data);
                break;

            case "info":
                data = await axios.get("/game/character/info");
                data = data.data;
                if (data.error != null) {
                    msg = data.error;
                } else {
                    msg = TextDrawing.userInfoPanel(data);
                }
                break;

            case "up":
                data = await axios.post("/game/character/up", {
                    attr: args[0],
                    number: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = Translator.getString(data.lang, "character", "attribute_up_to", [this.getToStrShort(args[0]), data.value]) +
                        ". " + (data.pointsLeft > 1 ?
                            Translator.getString(data.lang, "character", "attribute_x_points_available_plural", [data.pointsLeft]) :
                            Translator.getString(data.lang, "character", "attribute_x_points_available", [data.pointsLeft]));
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }


}

module.exports = CharacterModule;