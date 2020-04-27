const conn = require("../../conf/mysql");
const axios = require("axios").default;
const conf = require("../../conf/conf");
const Globals = require("../Globals");
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
        if (status != null && status["desktop"]) {
            this.isOnMobile = false;
        } else {
            this.isOnMobile = true;
        }
    }

    getAxios() {
        return this.axios;
    }


}

module.exports = User;