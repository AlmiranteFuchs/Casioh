// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require("venom-bot");
const commands = require("./commands");
var triggers = require("./triggers");

venom
  .create((statusSession, session) => {
    console.log("Status Session: ", statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
    //Create session wss return "serverClose" case server for close
    console.log("Session name: ", session);
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
  triggers.start(client);

  //On new message-->
  client.onMessage(async (message) => {
    let messageStr = "" + message.body.toString();
    let isImg = false;
    if (
      message.isMedia === true ||
      message.isMMS === true /* && message.isGroupMsg === true */
    ) {
      messageStr = "" + message.caption.toString();
      isImg = true;
    }

    if (messageStr.startsWith("/") /*  && message.isGroupMsg === true */) {

      triggers.TriggerCommands(message, isImg, client);
    }else{
      triggers.TriggerLookUp(message, client)
    }
  });
}

/* async function test(client) {
  const messages = await client.getAllUnreadMessages();
  console.log(messages);
}
 */