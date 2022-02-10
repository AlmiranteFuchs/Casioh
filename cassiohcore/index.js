const venom = require("venom-bot");
/* 554498579172@c.us */

class Bot {
  constructor() {
    this.initialize();
  }

  initialize = async () => {
    this.client = await this.getVenomClient();
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

    const list = [
      {
        title: "Pasta",
        rows: [
          {
            title: "Ravioli Lasagna",
            description: "Made with layers of frozen cheese",
          },
        ],
      },
      {
        title: "Dessert",
        rows: [
          {
            title: "Baked Ricotta Cake",
            description: "Sweets pecan baklava rolls",
          },
          {
            title: "Lemon Meringue Pie",
            description: "Pastry filled with lemonand meringue.",
          },
        ],
      },
    ];
    await this.client
      .sendListMenu(
        "554498579172@c.us",
        "Title",
        "subTitle",
        "Description",
        "menu",
        list
      )
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  };

  onReceiveMessage = (message) => {
    /*   const isImage = message.isMedia || message.isMMS;
    const messageText = isImage ? message.caption : message.body;

    if (messageText.startsWith(commandStart)) {
      triggers.TriggerCommands(message, isImage, this.client);
    } else {
      triggers.TriggerLookUp(message, this.client);
    } */
  };
}
const bot = new Bot();
