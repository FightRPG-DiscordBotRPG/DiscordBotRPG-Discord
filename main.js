const conf = require("./conf/conf");

const {
    ShardingManager,
    User
} = require('discord.js');

const Globals = require("./src/Globals");
const manager = new ShardingManager(__dirname + '/bot.js', {
    token: conf.discordbotkey,
    //totalShards: conf.env === "dev" ? 2 : "auto",
});

async function start() {
    console.log("Preparing appearances for all shards, please wait");
    console.time("Appearances Cache Loaded");
    await Globals.loadAllAppearances();
    console.timeEnd("Appearances Cache Loaded");


    manager.spawn();
    manager.on('launch', shard => {
        console.log(`Launched shard ${shard.id}`);
    });
}




/**
 * 
 * @param {string} idUser
 * @param {string} message
 */
async function sendDMToSpecificUser(idUser, message) {
    try {
        /**
         * @type {Array<User>}
         **/
        let users = await manager.broadcastEval((client, context) => client.users.cache.get(context.idUser), { context: {idUser: idUser}});
        for (let i in users) {
            if (users[i]) {
                await [...manager.shards.values()][i].eval(`this.users.cache.get("${idUser}").send(\`${message.replace(/`/gi, "\\`")}\`).catch(e => null)`);
                return true;
            }
        }
    } catch (e) {
        console.log(e);
    }

    return false;
}

async function sendWorldBossMessage(message) {
    let evalDyn;

    if (conf.env == "dev") {
        evalDyn = (client) => {
            let channel = client.channels.cache.get("456119917943717888");
            if (channel != null) {
                channel.send(message).catch((e) => { null });
            }
        }
    } else {
        evalDyn = (client) => {
            let channel = client.channels.cache.get("520585589612085258");
            if (channel != null) {
                channel.send(message).catch((e) => { null });
            }
        };
    }

    try {
        await manager.broadcastEval(evalDyn);
    } catch (e) {
        console.log(e);
    }
}

const express = require("express"),
    app = express(),
    port = 48921,
    url = require('url');
app.disable("x-powered-by");


app.listen(port, () => console.log("Local webhook for discord notifications at port: " + port));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
require('express-async-errors');

app.use("/usr", async (req, res) => {
    if (req.body.id != null && typeof req.body.id == "string") {
        if (req.body.message != null && typeof req.body.message == "string") {
            let result = await sendDMToSpecificUser(req.body.id, req.body.message);
            return res.json({
                sended: result,
            });
        }
    }
    return res.json({
        sended: false
    });
});

app.use("/wb", async (req, res) => {
    if (req.body.message != null && typeof req.body.message == "string") {
        sendWorldBossMessage(req.body.message);
        return res.json({
            sended: true,
        });
    }
    return res.json({
        sended: false,
    });
});

start();