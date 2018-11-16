const botkey = require("./conf/botkey");

const {
    ShardingManager
} = require('discord.js');
const manager = new ShardingManager('./bot.js', {
    token: botkey,
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

app.use("/", async (req, res) => {
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