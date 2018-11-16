const conn = require("../../conf/mysql");
const axios = require("axios").default;
const conf = require("../../conf/conf");
class User {
    constructor(id, username, avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.token = null;
        this.axios;
    }

    async load() {
        let res = await conn.query("SELECT token FROM users WHERE idUser = ?;", [this.id]);
        if (res[0]) {
            this.token = res[0].token;
            this.initAxios();
        }
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
            this.initAxios();
        }
    }

    initAxios() {
        this.axios = axios.create({
            headers: {
                'Authorization': "Bearer " + this.token
            }
        })
    }

    getAxios() {
        return this.axios;
    }


}

module.exports = User;