class Leaderboard {

    constructor(data) {
        this.rankings = data.rankings;
        this.offset = data.offset;
        this.maximumRank = data.maximumRank;
        this.sumOfAll = data.sumOfAll;
        this.lang = data.lang;
    }

    draw() {
        throw "Draw function must be implemented";
    }

    getNumberLength(number) {
        let numberLength = number.toString();
        return numberLength.length;
    }
}

module.exports = Leaderboard;