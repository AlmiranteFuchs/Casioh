const venom = require("venom-bot");
const commands = require("./commands");
var triggers = require("./triggers");


const commandStart = '/';


class Bot {
  constructor() {
    this.initialize();
  }

  initialize = async () => {
    this.client = await this.getVenomClient();
    this.start();
  }
  
  getVenomClient = async () => {
    const client = await venom.create((statusSession, session) => {
                        console.log(`Status session: ${statusSession}`);
                        console.log(`Session name: ${session}`);
                      })
                      .then(client => client);

    return client;
  }

  start = () => {
    triggers.start(this.client);

    this.client.onMessage(message => this.onReceiveMessage(message));
  }

  onReceiveMessage = message => {
    const isImage = message.isMedia || message.isMMS;
    const messageText = isImage ? message.caption : message.body;

    if (messageText.startsWith(commandStart)) {
      triggers.TriggerCommands(message, isImage, this.client);
    } else {
      triggers.TriggerLookUp(message, this.client);
    }
    
  }
}

const bot = new Bot();
