const conf = require("./conf/conf");

const {
    ShardingManager
} = require('discord.js');
const manager = new ShardingManager('./bot.js', {
    token: conf.discordbotkey
});

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));

async function sendDMToSpecificUser(idUser, message) {
    let evalDyn = `let user = this.users.get("${idUser}");
    if(user != null) {
        user.send(\`${message}\`).catch((e) => {null});
    }
    `;
    try {
        await manager.broadcastEval(evalDyn);
    } catch (e) {
        console.log(e);
    }

}

async function sendWorldBossMessage(message) {
    let evalDyn;

    if (conf.env == "dev") {
        evalDyn = `let channel = this.channels.get("456119917943717888");
    if(channel != null) {
        channel.send(\`${message}\`).catch((e) => {null});
    }
    `;
    } else {
        evalDyn = `let channel = this.channels.get("520585589612085258");
    if(channel != null) {
        channel.send(\`${message}\`).catch((e) => {null});
    }
    `;
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


app.listen(port, () => console.log("Local webhook for discord notifications at port: " + port));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
require('express-async-errors');

app.use("/usr", async (req, res) => {
    if (req.body.id != null && typeof req.body.id == "string") {
        if (req.body.message != null && typeof req.body.message == "string") {
            sendDMToSpecificUser(req.body.id, req.body.message);
            return res.json({
                sended: "yes"
            });
        }
    }
    return res.json({
        sended: "no"
    });
});

app.use("/wb", async (req, res) => {
    if (req.body.message != null && typeof req.body.message == "string") {
        sendWorldBossMessage(req.body.message);
        return res.json({
            sended: "yes"
        });
    }
    return res.json({
        sended: "no"
    });
});