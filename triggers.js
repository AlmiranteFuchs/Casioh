const { CheckOffense } = require("./commands.js");
var commands = require("./commands.js");
const text = require("./text.js");
var txt = require("./text.js");
const fs = require("fs");
const mime = require("mime-types");

module.exports = {
  const: (Apps = {
    DOTA: "dota",
    MINE: "mine",
  }),

  start: function (client) {
    commands.Start(client);
  },

  TriggerCommands: async function (message, isImg, _client) {
    let args;
    let arg1;
    let arg2;
    let command;
    let http;
    console.log(!!message.body.toString().split(/ +/)[1]);

    if (isImg) {
      if (!!message.caption.toString().split(/ +/)[1]) {
        console.log("com arg img");

        args = message.caption.toString().split(/ +/);
        arg1 = args[1].toString().toLowerCase().replace("/", "");
        if (!!args[2]) {
          arg2 = args[2].toString().toLowerCase().replace("/", "");
        }
        http = arg1;
        command = args[0].toString().toLowerCase();
      } else {
        command = message.caption.toString().toLowerCase();
      }
    } else {
      if (!!message.body.toString().split(/ +/)[1]) {
        console.log("com arg n img");
        args = message.body.toString().split(/ +/);
        arg1 = args[1].toString().toLowerCase().replace("/", "");
        if (!!args[2]) {
          arg2 = args[2].toString().toLowerCase().replace("/", "");
        }
        http = arg1;
        command = args[0].toString().toLowerCase();
      } else {
        command = message.body.toString().toLowerCase();
      }
    }

    if (command == "/help") {
      commands.SendReply(message, text.help);
      commands.SendTextOnReply(message, text.help2);
      return;
    }

    if (command == "/everyone") {
      commands.EveryonePing(message);
      return;
    }

    if (command == "/sticker") {
      if (isImg) {
        console.log("Downloading File");
        const buffer = await _client.decryptFile(message);
        const fileName = `midia/recentMidia${commands.GetGpUserId(
          true,
          message.from
        )}.${mime.extension(message.mimetype)}`; //TODO-> GroupIDrecentMidia
        await fs.writeFile(fileName, buffer, (err) => {
          if (err) {
            commands.SendReply(message, err.toString());
            return;
          }
          commands.SendSticker(false, fileName, message);
        });
        return;
      }
      /* if (arg1 !== "" && arg1 !== null) {
                //Args
                commands.SendSticker(false, http, message)
                return
            } */
      commands.SendReply(
        message,
        "Mudanças foram feitas, use o comando na descrição da imagem"
      );
      return;
    }

    if (command == "/stickergif") {
      if (isImg) {
        //Senão, pegue a ultima mídia
        console.log("Downloading File");
        const buffer = await _client.decryptFile(message);
        const fileName = `midia/recentMidia${commands.GetGpUserId(
          true,
          message.from
        )}.${mime.extension(message.mimetype)}`; //TODO-> GroupIDrecentMidia
        await fs.writeFile(fileName, buffer, (err) => {
          if (err) {
            commands.SendReply(message, err.toString());
            return;
          }
          commands.ConvertMidiaGif(
            fileName,
            `midia/recentMidia${commands.GetGpUserId(true, message.from)}.gif`,
            message
          );
        });
        return;
      }
      /*  if (arg1 !== "" && arg1 !== null) {
                 commands.SendSticker(true, http, message)
                 return
             } */
      commands.SendReply(
        message,
        "Mudanças foram feitas, use o comando na descrição da imagem"
      );
      return;
    }

    if (command == "/createoffence") {
      if (arg1 == null || arg2 == null) {
        commands.SendReply(message, "Argumentos faltam ai brother");
        return;
      }
      commands.CreateOffence(arg1, arg2, message);
      return;
    }

    if (command == "/createcopypasta") {
      if (arg1 == null || arg2 == null) {
        commands.SendReply(message, "Argumentos faltam ai brother");
        return;
      }
      commands.CreateCopyPasta(
        arg1,
        message.body
          .toString()
          .substring(message.body.toString().indexOf(arg1) + arg1.length + 1),
        message
      );
      return;
    }

    if (
      message.body.toString().toLowerCase().toString().includes("/bom dia bot")
    ) {
      commands.SendReply(message, "bo dia");
    }

    if (command == "/dota2") {
      commands.OpenApp(Apps.DOTA);
      return;
    }

    if (command == "/mine") {
      commands.OpenApp(Apps.MINE);
      return;
    }

    if (command == "/search") {
      if (arg1 == null) {
        commands.SendReply(message, "Você quer que eu pesquise sobre??");
        return;
      }
      commands.WikiSearch(arg1, arg2, message);
    }

    if (command == "/m") {
      let m = message.body.toString();
      commands.SendToBot(message, m);
    }

    if (!!arg1) {
      if (
        await commands.CheckOffense(
          command.toString().replace("/", ""),
          arg1,
          message
        )
      ) {
        //Count
        commands.OffenseCounter(
          command.toString().replace("/", ""),
          arg1,
          message
        );
        return;
      }
      return;
    }

    if (
      await commands.CheckCopy(command.toString().replace("/", ""), message)
    ) {
      return;
    }

    commands.SendReply(message, "Nenhum comando encontrado com isso ai chapa");
  },

  TriggerLookUp: async function (message, _client) {
    let command = message.body.toString().toLowerCase().toString();
    if (command.includes("hoefel")) {
        
      commands.SendTextOnReply(message, text.hoefel);
      return;
    }
  },
};
