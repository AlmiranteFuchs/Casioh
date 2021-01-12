// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const fs = require('fs');
const mime = require('mime-types');
const venom = require('venom-bot');
const commands = require('./commands');

var triggers = require('./triggers')
venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
  triggers.start(client)

  //On new message-->
  client.onMessage(async (message) => {
    if (message.isMedia === true || message.isMMS === true && message.isGroupMsg === true) {
      console.log("Tentando baixar")
      const buffer = await client.decryptFile(message);
      const fileName = `midia/recentMidia${commands.GetGpUserId(true, message.from)}.${mime.extension(message.mimetype)}`; //TODO-> GroupIDrecentMidia
      await fs.writeFile(fileName, buffer, (err) => {
      });
      return
    }

    let messageStr = "" + message.body.toString()
    if (messageStr.startsWith("/") && message.isGroupMsg === true) {
      triggers.TriggerCommands(message)
    }
  });
}




