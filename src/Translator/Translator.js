const fs = require("fs");
const Intl = require("intl");

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

    static formatString(s, args, lang = "en") {
        let str = "",
            tempStr;
        let argsAlreadyPassed = 0;
        let lastPos = 0;
        for (let i = 0; i < s.length - 1; i++) {
            if (s.charCodeAt(i) === 37 && argsAlreadyPassed < s.length) {
                let nc = s.charCodeAt(++i);
                switch (nc) {
                    case 115:
                        tempStr = String(args[argsAlreadyPassed]);
                        break;
                    case 100:
                        let num = args[argsAlreadyPassed];
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

    static load(callback) {
        var self = this;
        fs.readdir(__dirname + "/locale", (err, filenames) => {
            if (!err) {
                for (let i of filenames) {
                    self.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
                    self.nbOfTranslations++;
                }
                callback ? callback() : null;
            }
        })
    }

    static loadSync() {
        var filenames = fs.readdirSync(__dirname + "/locale");
        for (let i of filenames) {
            this.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
            this.nbOfTranslations++;
        }
    }
}

Translator.translations = {};
Translator.nbOfTranslations = 0;
Translator.formaters = {};
Translator.loadSync();
Translator.loadFormaters();

/*
var sizeof = require('object-sizeof');
console.log(sizeof(Translator.translations));*/

module.exports = Translator;