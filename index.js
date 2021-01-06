// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const fs = require('fs');
const mime = require('mime-types');
const venom = require('venom-bot');
var burro
var http

var ffmpeg = require("fluent-ffmpeg");
var inFilename = "recentMidia.mp4";
var outFilename = "recentMidia.gif";

fs.readFile("bernardoburro.json", function (err, data) {

  // Check for errors 
  if (err) throw err;

  // Converting to JSON 
  burro = JSON.parse(data);
});
venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
  //On new message-->
  client.onMessage(async (message) => {
    if (message.isMedia === true || message.isMMS === true && message.isGroupMsg === true) {
      console.log("Tent baixar")
      const buffer = await client.decryptFile(message);
      // At this point you can do whatever you want with the buffer
      // Most likely you want to write it into a file
      const fileName = `recentMidia.${mime.extension(message.mimetype)}`;
      await fs.writeFile(fileName, buffer, (err) => {

      });
      return
    }
    var messageStr = "" + message.body.toString()
    if (messageStr.startsWith("/") && message.isGroupMsg === true) {
      CommandTriggers(client, message)
    }
  });
}

//#region CommandTriggers
function getUserID(message) {
  var userID = message.split('-')[0]
  return userID
}
async function CommandTriggers(client, message) {
  async function send() {
    try {
      await client
        .sendImageAsStickerGif(message.from, http)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
          client.sendText(message.from, erro.toString())
        });
    } catch (error) {
      console.log(error)
      client.sendText(message.from, error.toString())
    }
  }
  //TODO--> DOLAR API, IMAGE TO STICKER, "vai tomar no cu" counter, ??
  let temp = message.body.toString().split(' ')[0]
  switch (temp) {

    case "/help":
      client.reply(message.from, "_Fala ai galera do futvolei, Bruno henrique bot do bruno fuchs maneiro_", message.id.toString())
      client.sendText(message.from, "_Todos comandos começam com '/', Ai eles:\n */help* (sim)\n */everyone* (chama o pessoal ai)\n */sticker* +link/img (pega link na mensagem ou a ultima foto pra sticker)\n */stickerGif* (mesmo com gif ou mp4)\n */bernardoBurro* (burro dms, ajuda a contar)\n */cristoferEstranho* (conta cristofer estranho)\n _isso ai_")
      break;

    case "/everyone":
      client.reply(message.from, "Ta", message.id.toString())
      userID = getUserID(message.from.toString())
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
      break;


    case "/sticker":
      http = message.body.toString()
      if (http == '/sticker') {
        http = 'recentMidia.jpeg'
      } else { http = message.body.toString().split(' ')[1] }
      try {
        await client
          .sendImageAsSticker(message.from, http)
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });

      } catch (error) {
        client.sendText(message.from, error.toString())
      }
      break;


    case "/stickerGif":
      http = message.body.toString()
      if (http == '/stickerGif') {
        try {
          ffmpeg(inFilename)
            .outputOption("-vf", "scale=320:-1:flags=lanczos,fps=15")
            .save(outFilename)
            .on('end', () => {
              http = 'recentMidia.gif'
              send();
            });
        } catch (error) {
          console.log(error)
        }
      } else { http = message.body.toString().split(' ')[1], send() }
      break;


    case "/bernardoBurro":
      burro.bernardo++
      client.sendText(message.from, 'Bernardo foi chamado de burro = ' + burro.bernardo + ' vezes')
      fs.writeFile("bernardoburro.json", JSON.stringify(burro), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
      });
      break;
    case "/cristoferEstranho":
      burro.cris++
      client.sendText(message.from, 'Cristofer foi chamado de estranho = ' + burro.cris + ' vezes')
      fs.writeFile("bernardoburro.json", JSON.stringify(burro), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
      });
      break;
    default:
      client.reply(message.from, "Escreveu certo em", message.id.toString())
      break;
  }
}



