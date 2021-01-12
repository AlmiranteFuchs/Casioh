var ffmpeg = require("fluent-ffmpeg");
var inFilename = "recentMidia.mp4";
var outFilename = "recentMidia.gif";
const fs = require('fs');

var offenseJson
var client

fs.readFile("offense.json", function (err, data) {

    // Check for errors 
    if (err) throw err;

    // Converting to JSON 
    offenseJson = JSON.parse(data);
});

module.exports = {
    Start: function (_client) {
        client = _client
    },

    //#region functions
    SendReply: async function (message, text) {
        client.reply(message.from, text, message.id.toString())
    },

    SendTextOnReply: async function (message, text) {
        client.sendText(message.from, text)
    },

    GetGpUserId: function (isGpID, messageID) {
        //If isgpid return the ID of the gp, else return user ID
        let nm = 0
        if (isGpID) { nm = 1 }
        var ID = messageID.split('-')[nm]
        return ID
    },

    SendSticker: async function (isGif, httpMidia, message) {
        let messagefrom = message.from
        if (isGif) {
            await client.sendImageAsStickerGif(messagefrom, httpMidia)
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                    client.reply(message.from, 'Algo aconteceu mb ai: ' + erro.toString(), message.id.toString())
                });
            return;
        }
        await client.sendImageAsSticker(messagefrom, httpMidia)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                client.reply(message.from, 'Algo aconteceu mb ai: ' + erro.toString(), message.id.toString())
            });
    },

    EveryonePing: async function (message) {
        this.SendReply(message, 'Okay, chamando todos os cornos')
        let vetorUsersId = []
        let stringMessage = ""
        try {
            await client.getGroupMembersIds(message.from)
                .then((userIDGp) => {
                    userIDGp.forEach(userIDGp => {
                        vetorUsersId.push(userIDGp.user)
                        if (stringMessage == "") {
                            stringMessage = 'Ao arrombados @' + userIDGp.user.toString() + ' '
                        } else {
                            stringMessage = stringMessage + '@' + userIDGp.user.toString() + ' '
                        }
                    });
                })
        } catch (error) {
            console.log(error)
            client.sendText(message.from, error)
        }
        client.sendMentioned(message.from, stringMessage
            , vetorUsersId)
    },

    ConvertMidiaGif: async function (intputFileName, outputFileName, message) {
        try {
            ffmpeg(inFilename)
                .outputOption("-vf", "scale=320:-1:flags=lanczos,fps=15")
                .save(outFilename)
                .on('end', () => {
                    let http = `midia/recentMidia${this.GetGpUserId(true, message.from)}.gif`
                    this.SendSticker(true, http, message);
                });
        } catch (error) {
            console.log(this.SendReply(message, error))
        }
    },

    OffenseCounter: async function (who, offense, message) {
        offenseJson[who][offense]++
        WriteJSON()
        this.SendReply(message, who + ' foi chamado(a) de ' + offense + '  = ' + offenseJson[who][offense] + ' vezes')
        return
    },

    CreateOffence: async function (who, offence, message) {
        //check if who exists --> create
        if (!offenseJson.hasOwnProperty(who)) {
            let temp = { [who]: { [offence]: 0 } }

            offenseJson = { ...offenseJson, ...temp }
            await WriteJSON()
            this.SendReply(message, "ofensa criada " + who + " ja pode ser chamado(a) de " + offence)
            return
        }
        if (offenseJson[who].hasOwnProperty(offence)) {
            this.SendReply(message, "Esse xingamento já existe, acho que você deveria ser o " + offence + " aqui ;)")
            return
        }
        //write
    },

    CheckOffense: async function (who, offense) {
        if (offenseJson.hasOwnProperty(who)) {
            console.log("Essa pessoa existe")
            if (offenseJson[who].hasOwnProperty(offense)) {
                console.log("Ofensa existe em pessoa")
                return true
            } else { return false }
        }
        return false
    }

    //#endregion functions
}
async function WriteJSON() {
    fs.writeFile("offense.json", JSON.stringify(offenseJson), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
    });
}






