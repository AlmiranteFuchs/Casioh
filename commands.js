var ffmpeg = require("fluent-ffmpeg");
var inFilename = "./recentMidia.mp4";
var outFilename = "./recentMidia.gif";
const ipc = require('node-ipc');
const path = require('path');
const lerolero = require('lerolero')


const fs = require('fs');
const ytdl = require('ytdl-core');
const wiki = require('wikijs').default;

var offenseJson
var copypastaJson
var client

const talkedRecently = new Set();
const admID = '554498579172@c.us'

var minebot
var connected = false


fs.readFile("offense.json", function (err, data) {

    // Check for errors 
    if (err) throw err;

    // Converting to JSON 
    offenseJson = JSON.parse(data);
});

fs.readFile("copypasta.json", function (err, data) {

    // Check for errors 
    if (err) throw err;

    // Converting to JSON 
    copypastaJson = JSON.parse(data);
});

module.exports = {
    Start: function (_client) {
        client = _client
    },

    //#region functions
    SendReply: async function (message, text) {
        await client.reply(message.from, text, message.id.toString()
        )
    },

    SendTextOnReply: async function (message, text) {
        await client.sendText(message.from, text).then((result) => {
            console.log('Result: ', 'result'); //return object success
        }).catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
        });
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
                    console.log('Result: ', 'result'); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                    client.reply(message.from, 'Algo aconteceu mb ai: ' + erro.toString(), message.id.toString())
                });
            return;
        }
        await client.sendImageAsSticker(messagefrom, httpMidia)
            .then((result) => {
                console.log('Result: ', 'result'); //return object success
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
            await client.sendText(message.from, error)
        }
        await client.sendMentioned(message.from, stringMessage
            , vetorUsersId)
    },

    ConvertMidiaGif: async function (intputFileName, outputFileName, message) {
        try {
            ffmpeg(`midia/recentMidia${this.GetGpUserId(true, message.from)}.mp4`)
                .outputOption("-vf", "scale=320:-1:flags=lanczos,fps=15")
                .save(`midia/recentMidia${this.GetGpUserId(true, message.from)}.gif`)
                .on('end', () => {
                    let http = `midia/recentMidia${this.GetGpUserId(true, message.from)}.gif`
                    this.SendSticker(true, http, message);
                });
        } catch (error) {
            console.log(this.SendReply(message, error))
            this.SendReply(message, error)
        }
    },

    Hoefel: async function(message, texto) {
        offenseJson['hoefel']++
        WriteJSON()
        this.SendTextOnReply(message, texto+"\n"+offenseJson['hoefel']+" _Vezes..._");
    },

    HoefelFrase: async function(message) {
        this.SendTextOnReply(message, lerolero()+"\n_-Hoefel..._");
    },

    //#region offense 
    OffenseCounter: async function (who, offense, message) {
        if (talkedRecently.has(this.GetGpUserId(false, message.id.toString()))) {
            this.SendReply(message, "Da pra moderar com o spam meu cria?")
            return
        }
        console.log('talkedRecently')
        talkedRecently.add(this.GetGpUserId(false, message.id.toString()));
        setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(this.GetGpUserId(false, message.id.toString()));
        }, 6000);

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
        } else {
            let temp = { [who]: { [offence]: 0 } }

            offenseJson = { ...offenseJson, ...temp }
            await WriteJSON()
            this.SendReply(message, "ofensa criada " + who + " ja pode ser chamado(a) de " + offence)
            return
        }
        //write
    },

    CheckOffense: async function (who, offense, message) {
        if (who == "bot") {
            this.SendReply(message, offense + " é tu seu " + offense)
            return
        }
        if (offenseJson.hasOwnProperty(who)) {
            /* console.log("Essa pessoa existe") */
            if (offenseJson[who].hasOwnProperty(offense)) {
               /*  console.log("Ofensa existe em pessoa") */
                return true
            } else {
                this.SendReply(message, "Ofensa não existe nessa pessoa")
                /* console.log("Ofensa não existe") */
                return false
            }
        }
        return false
    },

    CheckCopy: async function (name, message) {
        if (copypastaJson.hasOwnProperty(name)) {
            this.SendReply(message, copypastaJson[name].toString())
            return true
        }
        return false
    },

    CreateCopyPasta: async function (name, copypasta, message) {
        if (copypastaJson.hasOwnProperty(name)) {
            this.SendReply(message, "Esse nome para copypasta já existe, tente outro")
            return
        }
        let temp = { [name]: [copypasta] }
        copypastaJson = { ...copypastaJson, ...temp }
        this.SendReply(message, "Copypasta criada")
        await WriteCopyJSON()
    },
    //#endregion offense  

    OpenApp: async function (app) {
        switch (app) {
            case 'dota':
                var exec = require('child_process').exec;
                exec("locals\\Dota2.url");
                break;
            case 'mine':
                MineZap()
                break;
        }
    },

    WikiSearch: async function (page, info, message) {
        let search
        await wiki().page(page).then(page => page.info(info))
            .then(function (result) {
                search = JSON.stringify(result)
            }).catch(
                this.SendReply(message, "Hum, tem algo errado com essa pesquisa, talvez não tenha artigo ou o input esteja incorreto"));
        this.SendReply(message, search)
    },

    SendToBot: async function (message, m) {
        if (connected) {
            m = m.replace("/m", "")
            /* console.log("Message to send= " + m) */
            minebot.send({ hello: 'world' })
            return
        }
        this.SendReply(message, "Bot não está On")
        return
    }
}


//#endregion functions

async function WriteJSON() {
    fs.writeFile("offense.json", JSON.stringify(offenseJson), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
    });
} async function WriteCopyJSON() {
    fs.writeFile("copypasta.json", JSON.stringify(copypastaJson), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
    });
}

function MineZap() {
    if (!connected && minebot !== null) {
        connected = true
        minebot = require('child_process').fork('C:\\Users\\note\\Desktop\\Projetos e Documentos\\DemonDaysMineBot\\index.js');
        minebot.on('close', () => {
            connected = false
            minebot = null
        })
        minebot.on('disconnect', () => {
            connected = false
            minebot = null
        })

        minebot.on('message', function (m) {
            switch (m) {
                case "START":
                    console.log("Bot ta aberto")
                    break;
            }
        });
        return
    }
    console.log("Process already Exist")
}







