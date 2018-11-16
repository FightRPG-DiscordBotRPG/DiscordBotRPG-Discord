const GModule = require("./GModule");
const Globals = require("../Globals");
const fs = require("fs");
const conn = require("../../conf/mysql");
const Discord = require("discord.js");
const User = require("../Users/User");
const Translator = require("../Translator/Translator");

class ModuleHandler extends GModule {
    constructor() {
        super();
        this.isReloadable = false;
        this.prefixes = {};
        this.prefix = "::";
        this.devMode = false;
        /**
         * @type {Array<GModule>}
         */
        this.modules = {};
        /**
         * @type {Array<GModule>}
         */
        this.commandsReact = {};
        this.startLoading("ModuleHandler");
        this.init();
        this.endLoading("ModuleHandler");
    }

    init() {
        this.loadAllModules();
        this.loadPrefixes();
    }

    loadAllModules() {
        fs.readdirSync(__dirname + "/Modules/").forEach(file => {
            this.loadModule(file);
        });
    }

    async run(message) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let prefix = this.getPrefix(message.channel.guild ? message.channel.guild.id : null);
        if (!message.content.startsWith(prefix)) return;

        let args = [].concat.apply([], message.content.slice(prefix.length).trim().split('"').map(function (v, i) {
            return i % 2 ? v : v.split(' ')
        })).filter(Boolean);

        let command = args.shift();
        command = command != null ? command.toLowerCase() : "";


        if (!message.author.bot && command != null) {
            let dt = Date.now();
            let isAdmin = Globals.admins.indexOf(authorIdentifier) > -1;
            let data;
            this.logCommand(authorIdentifier, command, Date.now());
            await this.connectUser(message);

            // exec module corresponding to command
            await this.executeCommand(message, command, args);

            let axios = Globals.connectedUsers[authorIdentifier].getAxios();
            switch (command) {
                case "prefix":
                    msg = this.prefixCommand(message, command, args, "en");
                    break;
                case "load_module":
                    if (isAdmin) {
                        if (this.loadModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " loaded successfully !\n";
                        } else {
                            msg = "Discord: An error occured when loading the module, module may not exist or can't be reloaded\n";
                        }

                        data = await axios.post("/load_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "disable_module":
                    if (isAdmin) {
                        if (this.disableModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " disabled successfully !\n";
                        } else {
                            msg = "Discord: This module doesn't exist\n";
                        }

                        data = await axios.post("/disable_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "enable_module":
                    if (isAdmin) {
                        if (this.enableModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " enabled successfully !\n";
                        } else {
                            msg = "Discord: This module doesn't exist\n";
                        }

                        data = await axios.post("/enable_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "load_all_modules":
                    /*if (isAdmin) {
                        this.loadAllModules();
                        msg = "Done, check console for errors / warning";
                    }*/
                    break;
                case "disabled_modules":
                    /* if (isAdmin) {
                         msg = this.getDisabledModules();
                     }*/
                    break;
            }

            this.sendMessage(message, msg);
            //console.log("Performing command, took : " + ((Date.now() - dt) / 1000) + " seconds");
        }
    }

    getDisabledModules() {
        let cmds = "";
        for (let m in this.modules) {
            if (!this.modules[m].isActive) {
                cmds += this.modules[m].commands.toString() + "\n";
            }
        }
        return cmds != "" ? cmds : "Tous les modules fonctionnent";
    }

    loadModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (fs.existsSync(__dirname + "/Modules/" + moduleName + ".js")) {
                if (this.modules[moduleName] != null) {
                    if (this.modules[moduleName].isReloadable) {
                        for (let cmd of this.modules[moduleName].commands) {
                            if (this.commandsReact[cmd]) delete this.commandsReact[cmd];
                        }
                        delete this.modules[moduleName];
                        delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                        return this.loadModule(moduleName);
                    }
                } else {
                    // new module
                    let moduleObject = require("./Modules/" + moduleName);
                    if (moduleObject != null && typeof (moduleObject) == "function") {
                        let mod = new moduleObject();
                        if (mod.isModule) {
                            this.modules[moduleName] = mod;
                            for (let cmd of mod.commands) {
                                this.commandsReact[cmd] = mod;
                            }
                            return true;
                        } else {
                            delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                        }
                    } else {
                        delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                    }
                }
            }

        }

        return false;
    }

    prefixCommand(message, command, args, lang) {
        if (message.guild && message.author.id === message.guild.ownerID) {
            if (args[0]) {
                if (args[0].length <= 10) {
                    let oldPrefix = this.getPrefix(message.guild.id);
                    this.prefixChange(message.guild.id, args[0]); // async
                    return new Discord.RichEmbed()
                        .setColor([0, 128, 128])
                        .setAuthor(Translator.getString(lang, "other", "prefix_changed"))
                        .addField(Translator.getString(lang, "other", "old_prefix"), oldPrefix)
                        .addField(Translator.getString(lang, "other", "new_prefix"), this.getPrefix(message.guild.id));
                } else {
                    return Translator.getString(lang, "errors", "prefix_max_length", [10]);
                }
            } else {
                return Translator.getString(lang, "errors", "prefix_undefined");
            }
        } else {
            return Translator.getString(lang, "errors", "prefix_not_owner_server");
        }
    }

    async prefixChange(idServer, newPrefix) {
        this.prefixes[idServer] = newPrefix;
        await conn.query("UPDATE serversstats SET serverPrefix = ? WHERE idServer = ?", [newPrefix, idServer]);
    }

    loadPrefixes() {
        conn.query("SELECT idServer, serverPrefix FROM serversstats WHERE serverPrefix != '::'").then((prefixes) => {
            for (let result of prefixes) {
                this.prefixes[result.idServer] = result.serverPrefix;
            }
        });
    }

    getPrefix(idServer) {
        if (this.prefixes[idServer]) {
            return this.prefixes[idServer];
        }
        return this.prefix;
    }

    disableModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (this.modules[moduleName] != null) {
                this.modules[moduleName].isActive = false;
                return true;
            }
        }
        return false;
    }

    enableModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (this.modules[moduleName] != null) {
                this.modules[moduleName].isActive = true;
                return true;
            }
        }
        return false;
    }

    async executeCommand(message, command, args) {
        let mod = this.commandsReact[command];
        if (mod != null) {
            if (mod.isActive) {
                try {
                    await mod.run(message, command, args);
                } catch (err) {
                    if (!this.devMode) {
                        let adminTell = "A module has crashed.\nCommand : " + command + "\nArgs : [" + args.toString() + "]\n" + "User that have crashed the command : " + message.author.username + "#" + message.author.discriminator;
                        message.channel.send("There is a problem with the discord bot. The following commands is impacted : " + mod.commands.toString()).catch((e) => null);
                        message.client.shard.broadcastEval(`let user = this.users.get("241564725870198785");
                            if(user != null) {
                                user.send(\`${adminTell}\`).catch((e) => {null});
                            }`);
                    }
                    throw err;
                }
            } else {
                message.channel.send("Due to an error, this module is currently deactivated. The following commands will be disabled : " + mod.commands.toString() + "\nSorry for the inconvenience.").catch((e) => null);
            }
        }
    }

    async connectUser(message) {
        if (!Globals.connectedUsers[message.author.id]) {
            let user = new User(message.author.id, message.author.tag, message.author.avatarURL);
            await user.load();
            if (user.token == null) {
                await user.createUser();
                message.author.send(Translator.getString("en", "help_panel", "tutorial", [Globals.tutorialLink])).catch((e) => {
                    console.log(e)
                });
            }
            Globals.connectedUsers[message.author.id] = user;
        }
    }

    async logCommand(userid, command, timestamp) {
        if (timestamp == null) {
            timestamp = Date.now();
        }
        await conn.query("INSERT INTO commandslogs VALUES(NULL, ?, ?, ?);", [userid, command == null || command == "" ? "unknown" : command, timestamp]);
    }




}

module.exports = ModuleHandler;