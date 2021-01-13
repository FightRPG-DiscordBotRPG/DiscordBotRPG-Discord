const conn = require("../../conf/mysql");
const axios = require("axios").default;
const conf = require("../../conf/conf");
const Globals = require("../Globals");
const InfoPanel = require("../Drawings/Character/InfoPanel");
const UserChallenge = require("../AntiSpam/UserChallenge");
const WildArea = require("../Drawings/Areas/WildArea");
const CityArea = require("../Drawings/Areas/CityArea");
class User {
    constructor(id, username, avatar, lang="en") {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.lang = lang
        this.token = null;
        this.isOnMobile = false;
        this.lastCommandUsed = Date.now();
        this.axios = null;
        this.infoPanel = new InfoPanel();
        this.wildAreaDisplay = new WildArea();
        this.cityAreaDisplay = new CityArea();
        this.challenge = new UserChallenge(this);
    }

    async load() {
        let res = await conn.query("SELECT token FROM users WHERE idUser = ?;", [this.id]);
        if (res[0]) {
            this.token = res[0].token;
            this.initAxios();

            await this.axios.post("/game/character/update", {
                username: this.username
            });

            this.lang = (await this.axios.post("/game/other/lang")).data.lang;
        }
    }

    setLang(lang = "en") {
        this.lang = lang;
    }

    async createUser() {
        let res = await axios.post("/register", {
            key: conf.registerkey,
            id: this.id,
            username: this.username,
            avatar: this.avatar,
        });
        if (res.data && res.data.token) {
            this.token = res.data.token;
        }
        this.initAxios();
    }

    initAxios() {
        this.axios = axios.create({
            headers: {
                'Authorization': "Bearer " + this.token
            }
        })
    }

    setMobile(status) {
        if (status != null && (status["desktop"] || status["web"])) {
            this.isOnMobile = false;
        } else {
            this.isOnMobile = true;
        }
    }

    getAxios() {
        return this.axios;
    }

    isAdmin() {
        return Globals.admins.indexOf(this.id) > -1;
    }

    getAreaDisplay(data) {
        switch (data?.area?.type) {
            case "city":
                return this.cityAreaDisplay;
            default:
                return this.wildAreaDisplay;
        }
    }

}

module.exports = User;