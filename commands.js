var ffmpeg = require("fluent-ffmpeg");
var inFilename = "recentMidia.mp4";
var outFilename = "recentMidia.gif";
const fs = require('fs');
var burro
var client
fs.readFile("bernardoburro.json", function (err, data) {

    // Check for errors 
    if (err) throw err;

    // Converting to JSON 
    burro = JSON.parse(data);
});

module.exports = {
    start: function (_client) {
        client = _client
    },

    //#region functions
    sendReply: async function (message, text) {
        client.reply(message.from, text, message.id.toString())
    },

    sendTextOnReply: async function (message, text) {
        client.sendText(message.from, text)
    },

    getGpUserId: function (isGpID, messageID) {
        //If isgpid return the ID of the gp, else return user ID
        let nm = 0
        if (isGpID) { nm = 1 }
        var ID = messageID.split('-')[nm]
        return ID
    },

    sendSticker: async function (isGif, httpMidia, message) {
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

    everyonePing: async function (message) {
        this.sendReply(message, 'Okay, chamando todos os cornos')
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

    convertMidiaGif: async function (intputFileName, outputFileName, message) {
        try {
            ffmpeg(inFilename)
                .outputOption("-vf", "scale=320:-1:flags=lanczos,fps=15")
                .save(outFilename)
                .on('end', () => {
                    let http = 'recentMidia.gif'
                    this.sendSticker(true, http, message);
                });
        } catch (error) {
            console.log(error)
        }
    },

    burroCounter: async function (burroquem, offense, message) {
        let temp = burroquem.toLocaleLowerCase()
        burro[temp]++
        write()
        this.sendReply(message, burroquem + ' foi chamado de ' + offense + '  = ' + burro[temp] + ' vezes')
        return
    }
    //#endregion functions
}
async function write() {
    fs.writeFile("bernardoburro.json", JSON.stringify(burro), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
    });
}






