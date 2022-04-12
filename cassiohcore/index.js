const venom = require("venom-bot");
const { CommandsController } = require("./Controller/CommandsController.js");
/* 554498579172@c.us eu acho*/

class Cassioh {
  constructor() {
    this.initialize();
  }

  initialize = async () => {
    this.client = await this.getVenomClient();
    this.commands = new CommandsController(this.client);
    this.start();
  };

  getVenomClient = async () => {
    const client = await venom
      .create({
        session: "CasiohV2", //name of session
        multidevice: true, // for version not multidevice use false.(default: true)
      })
      .then((client) => client)
      .catch((erro) => {
        console.log(erro);
      });

    return client;
  };

  start = async () => {
    this.client.onMessage((message) => this.onReceiveMessage(message));
  };

  onReceiveMessage = (message) => {
    console.log(message);
  };
}
const bot = new Bot();
