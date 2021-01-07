var commands = require("./commands.js")

module.exports = {
    start: function (client) {
        commands.start(client)
    },

    TriggerCommands: async function (message) {
        let temp = message.body.toString().split(' ')[0].toLocaleLowerCase()
        switch (temp) {

            case "/help":
                commands.sendReply(message, "_Fala ai galera do futvolei, Bruno henrique bot do bruno fuchs maneiro_")
                commands.sendTextOnReply(message, "_Todos comandos começam com '/', Ai eles:\n */help* (sim)\n */everyone* (chama o pessoal ai)\n */sticker* +link/img (pega link na mensagem ou a ultima foto pra sticker)\n */stickerGif* (mesmo com gif ou mp4)\n */bernardoBurro* (burro dms, ajuda a contar)\n */christoferestranho* (conta cristofer estranho)\n _isso ai_")
                break;

            case "/everyone":
                commands.everyonePing(message)
                break;

            case "/sticker":
                http = message.body.toString()
                if (http == '/sticker') {
                    http = 'recentMidia.jpeg'
                } else { http = message.body.toString().split(' ')[1] }
                commands.sendSticker(false, http, message)
                break;

            case "/stickergif":
                http = message.body.toString()
                if (http == '/stickergif') {
                    commands.convertMidiaGif('recentMidia.mp4', 'recentMidia.gif', message)
                } else { http = message.body.toString().split(' ')[1], commands.sendSticker(true, http, message) }
                break;

            case "/bernardoburro":
                commands.burroCounter('Bernardo', 'burro', message)
                break;

            case "/christoferestranho":
                commands.burroCounter('Christofer', 'estranho', message)
                break;


            default:
                commands.sendReply(message, 'Ta certo isso ai em, muito bom')
                break;
        }
    }
}
