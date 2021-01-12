const { CheckOffense } = require("./commands.js")
var commands = require("./commands.js")
const text = require("./text.js")
var txt = require("./text.js")

module.exports = {
    start: function (client) {
        commands.Start(client)
    },

    TriggerCommands: async function (message) {
        let args
        let arg1
        let arg2
        let command
        let http
        console.log(!!message.body.toString().split(/ +/)[1])
        if (!!message.body.toString().split(/ +/)[1]) {
            console.log("com arg")
            args = message.body.toString().split(/ +/)
            arg1 = args[1].toString().toLowerCase().replace("/", "")
            if (!!args[2]) {
                arg2 = args[2].toString().toLowerCase().replace("/", "")
            }
            http = message.body.toString().split(/ +/)[1]
            command = args[0].toString().toLowerCase()
        } else {
            command = message.body.toString().toLowerCase()
        }



        if (command == "/help") {
            commands.SendReply(message, text.help)
            commands.SendTextOnReply(message, text.help2)
            return
        }

        if (command == "/everyone") {
            commands.EveryonePing(message)
            return
        }

        if (command == "/sticker") {
            if (!arg1 == "") {
                //Se possue argumento é link
                commands.SendSticker(false, http, message)
            } else {
                //Senão, pegue a ultima mídia
                commands.SendSticker(false, `midia/recentMidia${await commands.GetGpUserId(true, message.from)}.jpeg`, message)
            }
            return
        }

        if (command == "/stickergif") {
            if (!arg1 == "") {
                //Se possue argumento é link
                commands.SendSticker(true, http, message)
            } else {
                //Senão, pegue a ultima mídia
                commands.ConvertMidiaGif(`midia/recentMidia${await commands.GetGpUserId(true, message.from)}.mp4`, `midia/recentMidia${commands.GetGpUserId(true, message.from)}.gif`, message)
            }
            return
        }

        if (command == "/createoffence") {
            if (arg1 == null || arg2 == null) {
                commands.SendReply(message, "Argumentos faltam ai brother")
                return
            }
            commands.CreateOffence(arg1, arg2, message)
            return
        }

        if (!!arg1) {
            console.log("Checando ofensa " + command.toString().replace("/", "") + " " + arg1)
            if (await commands.CheckOffense(command.toString().replace("/", ""), arg1)) {
                console.log(commands.CheckOffense(await command.toString().replace("/", ""), arg1))
                //Count
                commands.OffenseCounter(command.toString().replace("/", ""), arg1, message)
                return
            }
            return
        }

        commands.SendReply(message, 'Nenhum comando encontrado com isso ai chapa')
    }
}
