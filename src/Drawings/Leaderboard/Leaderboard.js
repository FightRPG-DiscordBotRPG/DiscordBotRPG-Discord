const Translator = require("../../Translator/Translator");
const GenericMultipleEmbedList = require("../GenericMultipleEmbedList");
const Discord = require("discord.js");
const Emojis = require("../Emojis");
class Leaderboard {

    constructor(data) {
        this.load(data);
    }

    draw() {
        throw "Draw function must be implemented";
    }

    getNumberLength(number) {
        let numberLength = number.toString();
        return numberLength.length;
    }

    drawWithPages() {
        return `${this.draw()}\n${Translator.getString(this.lang, "general", "page_out_of_x", [this.page, this.maxPage])}`
    }

    /**
     * 
     * @param {string} title
     * @param {function} drawCallback
     * @returns {Discord.MessageEmbed}
     */
    getDisplay(title, drawCallback) {
        let listEmbed = new GenericMultipleEmbedList();

        listEmbed.load({
            collection: this.rankings, listType: 0, pageRelated: {
                page: this.page,
                maxPage: this.maxPage,
            }
        }, this.lang, drawCallback);

        listEmbed.fields.unshift(this.getYourRankString());

        return listEmbed.getEmbed(new Discord.MessageEmbed().setAuthor(title));
    }

    getItemOffsetStr(i) {
        let offset = this.offset + Number.parseInt(i) + 1;
        let offsetStr = offset.toString();
        return offsetStr.length < this.getNumberLength(this.rankings.length + this.offset - 1) ? ("0" + offsetStr) : offsetStr;
    }

    getFieldDisplay(value, maximumLength) {
        let field = Translator.getFormater(this.lang).format(value)
        return "`" + ".".repeat(maximumLength - field.length) + field + "`";
    }

    getIdAndNameString(user, showLevel) {
        return Emojis.getString("idFRPG") + "`" + this.getFieldDisplay(user.idCharacter, this.idMaximumLength) + "` - **" + user.userName + "** " + (showLevel ? "(" + Emojis.emojisProd.levelup.string + " " + user.actualLevel + ")" : "");
    }

    getPositionString(i) {
        return Emojis.getString("win") + "`" + (Translator.getFormater(this.lang).format(this.getItemOffsetStr(i))) + ".`"
    }

    getFullLine(user, i, content, showLevel=true) {
        return this.getPositionString(i) + content + this.getIdAndNameString(user, showLevel);
    }

    load(data) {
        this.rankings = data.rankings;
        this.offset = data.offset;
        this.maximumRank = data.maximumRank;
        this.sumOfAll = data.sumOfAll;
        this.maxPage = data.maxPage;
        this.page = data.page;
        this.lang = data.lang;
        this.playerRank = data.playerRank;
        this.maxOffset = this.offset + this.rankings.length;
        this.maxOffset = this.maxOffset.toString();
        this.maxOffset = this.maxOffset.length;


        let idMaximumLength = 0;

        for (let rank of this.rankings) {
            if (rank.idCharacter > idMaximumLength) {
                idMaximumLength = rank.idCharacter;
            }
        }

        this.idMaximumLength = Translator.getFormater(this.lang).format(idMaximumLength).length;
    }


    getYourRankString() {
        return Emojis.emojisProd.win.string + " " + Translator.getString(this.lang, "leaderboards", "your_rank", [this.playerRank, this.maximumRank]) + " " + Emojis.emojisProd.user.string;
    }
}

module.exports = Leaderboard;