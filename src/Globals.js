var axios = require("axios").default;
axios.defaults.baseURL = "http://localhost:8880";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 300 || status >= 400 && status < 500; // default
}


var Globals = {
    connectedUsers: {},
    "admins": ["241564725870198785", "285789367954440194", "228787710607753216", "403229406585421834"],
    "tutorialLink": "https://wiki.fight-rpg.com/doku.php?id=en:starter_guide",
    getRarityName: (idRarity) => {
        idRarity = parseInt(idRarity);
        let rarityName = "";
        switch (idRarity) {
            case 1:
                rarityName = "common";
                break;
            case 2:
                rarityName = "rare";
                break;
            case 3:
                rarityName = "superior";
                break;
            case 4:
                rarityName = "epic";
                break;
            case 5:
                rarityName = "legendary";
                break;
        }
        return rarityName;
    },
}

module.exports = Globals;