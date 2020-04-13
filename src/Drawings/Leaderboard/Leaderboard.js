const Translator = require("../../Translator/Translator");
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

    load(data) {
        this.rankings = data.rankings;
        this.offset = data.offset;
        this.maximumRank = data.maximumRank;
        this.sumOfAll = data.sumOfAll;
        this.maxPage = data.maxPage;
        this.page = data.page;
        this.lang = data.lang;
        this.playerRank = data.playerRank;
    }


    getYourRankString(lang = "en") {
        return Translator.getString(lang, "leaderboards", "your_rank", [this.playerRank]);
    }
}

module.exports = Leaderboard;