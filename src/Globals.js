var axios = require("axios").default;
axios.defaults.baseURL = "http://localhost:8880";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 300 || status >= 400 && status < 500; // default
}


var Globals = {
    connectedUsers: {},
    "admins": ["241564725870198785", "285789367954440194", "228787710607753216"],
    "tutorialLink": "https://docs.google.com/document/d/1ISXdBt5npR7oTjU0nxOkrEc10cd5OAcg-hG-rODmyIQ/edit?usp=sharing",
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