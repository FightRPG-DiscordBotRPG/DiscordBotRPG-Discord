const fs = require("fs");
const Intl = require("intl");
const axios = require("axios").default;
const TranslatorConf = require("../../conf/translator");
const Globals = require("../Globals");

class Translator {

    /**
     * 
     * @param {String} lang 
     * @param {String} type 
     * @param {String} name 
     * @param {Array} args 
     * @returns {String} Translated String / Or null
     */
    static getString(lang, type, name, args, returnNull = false) {
        if (!this.translations[lang]) {
            lang = "en";
        }
        if (this.translations[lang][type] && this.translations[lang][type][name]) {
            return this.formatString(this.translations[lang][type][name], args, lang);
        }
        if (lang != "en") {
            return this.getString("en", type, name, args, returnNull);
        }

        return returnNull ? null : lang + " | " + type + " | " + name;
    }

    static formatString(s, args = [], lang = "en") {
        let str = "",
            tempStr;
        let argsAlreadyPassed = 0;
        let lastPos = 0;
        let num;
        for (let i = 0; i < s.length - 1; i++) {
            if (s.charCodeAt(i) === 37 && argsAlreadyPassed < s.length) {
                let nc = s.charCodeAt(++i);
                switch (nc) {
                    case 115:
                        tempStr = String(args[argsAlreadyPassed]);
                        break;
                    case 100:
                        num = args[argsAlreadyPassed];
                        if (!isNaN(num)) {
                            tempStr = this.getFormater(lang).format(num);
                        } else {
                            tempStr = "NaN";
                        }
                        break;
                    default:
                        continue;
                }
                if (lastPos !== i - 1) {
                    str += s.slice(lastPos, i - 1);
                }
                str += tempStr;
                lastPos = i + 1;
                argsAlreadyPassed++;
            }
        }
        if (lastPos === 0) {
            str = s;
        } else if (lastPos < s.length) {
            str += s.slice(lastPos);
        }
        return str;
    }

    static loadFormaters() {
        for (let i in this.translations) {
            this.formaters[i] = new Intl.NumberFormat(i);
        }
    }

    /**
     * 
     * @returns {Intl.NumberFormat}
     */
    static getFormater(lang = "en") {
        return this.formaters[lang];
    }

    /**
     * 
     * @param {String} lang 
     * @returns {boolean}
     */
    static isLangExist(lang) {
        return this.translations[lang] ? true : false
    }

    /**
     * 
     * @param {string} lang 
     * @returns {string} List of available language Localized
     */
    static getAvailableLanguages(lang) {
        let data = {};
        for (let i in this.translations) {
            data[i] = this.getString(lang, "languages", i);
            //+= this.getString(lang, "languages", i) + " (" + i + ")" + (count == this.nbOfTranslations ? "" : ", ");
        }
        return data;
    }

    static async loadFromJson() {
        try {
            var conf = await axios.get(TranslatorConf.cdn_translator_url + 'config.json', { timeout: 2000 });
            conf = conf.data;
        } catch (e) {
            console.log("Unable to read Config File...\nLoading saved translations...");
            if (!fs.existsSync(__dirname + "/locale/")) {
                fs.mkdirSync(__dirname + "/locale");
            }
            let localeList = await fs.readdirSync(__dirname + "/locale/");
            var conf = { published_langs: [] };
            for (let item of localeList) {
                conf.published_langs.push(item.split(".")[0]);
            }
        }

        for (let lang of conf.published_langs) {
            try {
                let res = await axios.get(TranslatorConf.cdn_translator_url + lang + '.json', { timeout: 2000 });
                if (res.status == 200) {
                    this.translations[lang] = res.data;
                    this.nbOfTranslations++;
                    try {
                        fs.writeFileSync(__dirname + "/locale/" + lang + ".json", JSON.stringify(res.data));
                    } catch (e) {
                        console.log(e);
                        console.log("WARNING: Unable to save a backup for the translation file : " + lang + ".json");
                    }
                } else {
                    console.log("Unable to read from CDN the translation file : " + lang + ".json");
                    console.log("Loading from Backup files...");
                    try {
                        this.translations[lang] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + lang + ".json"));
                        this.nbOfTranslations++;
                        console.log("Backup Successfully Loaded !");
                    } catch (e) {
                        console.log("ERROR: Unable to read from backup file for the translation file : " + lang + ".json");
                    }
                }
            } catch (e) {
                console.log("CDN Unavailable for : " + lang + ".json");
                console.log("Loading from Backup files...");
                try {
                    this.translations[lang] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + lang + ".json"));
                    this.nbOfTranslations++;
                    console.log("Backup Successfully Loaded !");
                } catch (e) {
                    console.log("ERROR: Unable to read from backup file for the translation file : " + lang + ".json");
                }
            }
        }
    }

    static loadGlobalsRarities() {
        for (let lang in this.translations) {
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "common").toLowerCase()] = 1;
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "rare").toLowerCase()] = 2;
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "superior").toLowerCase()] = 3;
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "epic").toLowerCase()] = 4;
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "legendary").toLowerCase()] = 5;
            Globals.raritiesByLang[Translator.getString(lang, "rarities", "mythic").toLowerCase()] = 6;
        }
    }

    static loadGlobalsTypes() {
        for (let lang in this.translations) {
            Globals.typesByLang[Translator.getString(lang, "item_types", "weapon").toLowerCase()] = 1;
            Globals.typesByLang[Translator.getString(lang, "item_types", "chest").toLowerCase()] = 2;
            Globals.typesByLang[Translator.getString(lang, "item_types", "legs").toLowerCase()] = 3;
            Globals.typesByLang[Translator.getString(lang, "item_types", "head").toLowerCase()] = 4;
            Globals.typesByLang[Translator.getString(lang, "item_types", "resource").toLowerCase()] = 5;
            Globals.typesByLang[Translator.getString(lang, "item_types", "potion").toLowerCase()] = 6;
            Globals.typesByLang[Translator.getString(lang, "item_types", "lootbox").toLowerCase()] = 7;
            Globals.typesByLang[Translator.getString(lang, "item_types", "mount").toLowerCase()] = 8;
        }
    }
}



async function loadTranslator() {
    Translator.translations = {};
    Translator.nbOfTranslations = 0;
    Translator.formaters = {};
    await Translator.loadFromJson();
    Translator.loadFormaters();
    Translator.loadGlobalsRarities();
    Translator.loadGlobalsTypes();
}

loadTranslator();

/*
var sizeof = require('object-sizeof');
console.log(sizeof(Translator.translations));*/

module.exports = Translator;