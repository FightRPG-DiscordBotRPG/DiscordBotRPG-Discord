const Translator = require("../Translator/Translator");


class GenericMultipleEmbedList {
    constructor() {
        this.fields = [];
    }


    /**
     * 
     * @param {{collection: Array, displayIfEmpty: string, listType: Number, pageRelated: {page: Number, maxPage: Number}}} data List Type => 0 = one embed per entries | 1 = one embed every 1024 characters | 2 = one embed every 5 entries / Page related optional
     * @param {string} lang
     * @param {Function} lineDisplayCallback
     */
    load(data, lang, lineDisplayCallback) {

        this.fields = [];

        let contentString = "";

        let itemsKeys = Object.keys(data.collection);
        let lastIndex = itemsKeys[itemsKeys.length - 1];
        let index = 0;
        let empty = true;

        for (let i in data.collection) {
            let item = data.collection[i];

            let str = lineDisplayCallback(i, item);

            let shouldCreateEmbed = false;

            if (data.listType == 0) {
                shouldCreateEmbed = index != 0;
            } else if (data.listType == 1) {
                shouldCreateEmbed = (contentString.length + str.length) > 1024;
            } else {
                shouldCreateEmbed = (contentString.length + str.length > 1024) || (index % 5 == 4);
            }

            if (shouldCreateEmbed) {
                this.fields.push(contentString);
                contentString = "";
            }

            contentString += str;

            if (i == lastIndex) {
                this.fields.push(contentString);
                contentString = "";
            }

            index++;
            empty = false;
        }


        if (empty) {
            this.fields.push(data.displayIfEmpty);
        }

        if (data.pageRelated) {
            this.fields.push(Translator.getString(lang, "general", "page_out_of_x", [data.pageRelated.page, data.pageRelated.maxPage]));
        }

    }

    getEmbed(embed, separator ="--------------------------------------") {
        for (let i in this.fields) {
            embed.addField(separator, this.fields[i]);
        }

        return embed;
    }

}

module.exports = GenericMultipleEmbedList;