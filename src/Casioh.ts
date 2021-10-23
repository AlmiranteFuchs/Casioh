import { Message, Whatsapp } from 'venom-bot';
import { CommandController } from './CommandController';
import { MessageTrigger } from './MessageTrigger';
import { ResponseController } from './ResponseController';

const venom = require('venom-bot');

class Casioh {
  private static casioh: Casioh;

  private client: Whatsapp;
  private commandController: CommandController;
  private messageTrigger: MessageTrigger;
  private responseController: ResponseController;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): Casioh {
    if (!Casioh.casioh) {
      Casioh.casioh = new Casioh();
    }

    return Casioh.casioh;
  }

  private initialize = async () => {
    this.client = await this.getVenomClient();
    this.commandController = new CommandController();
    this.messageTrigger = new MessageTrigger(this.client, this.commandController);
    this.responseController = new ResponseController(this.client);
    this.start();
  }

  public getResponseController(): ResponseController {
    return this.responseController;
  }

  private getVenomClient = async () => {
    const client: Whatsapp = await venom.create((statusSession, session) => {
                        console.log(`Status session: ${statusSession}`);
                        console.log(`Session name: ${session}`);
                      })
                      .then(client => client);

    return client;
  }

  private start = () => {
    this.client.onMessage((message: Message) => this.onReceiveMessage(message));
  }

  public onReceiveMessage = async (message: Message) => {
    this.messageTrigger.processMessage(message);
  }
}

export { Casioh };
