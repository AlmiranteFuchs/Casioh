import { Message, Whatsapp } from 'venom-bot';
import { CommandController } from './CommandController';
import { MessageTrigger } from './MessageTrigger';

const venom = require('venom-bot');

class Casioh {
  private static casioh: Casioh;

  client: Whatsapp;
  commandController: CommandController;
  messageTrigger: MessageTrigger;

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
    this.start();
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
    const senderChat = message.from;

    const response = this.messageTrigger.processMessage(message);
  }

  private sendText = (recipient: string, text: string) => {
    this.client.sendText(recipient, text);
  }

  private sendTextTagged = (recipient: string, text: string, taggeds: string[]) => {
    this.client.sendMentioned(recipient, text, taggeds);
  }

  private sendTextReplyToMessage = (recipient: string, text: string, quotedMessageId: string) => {
    this.client.reply(recipient, text, quotedMessageId);
  }

  private sendTextLinkPreview = (recipient: string, url: string, title: string) => {
    this.client.sendLinkPreview(recipient, url, title);
  }

  private sendImage = (recipient: string, imagePath: string, imageName: string, caption: string = 'Caption') => {
    this.client.sendImage(recipient, imagePath, imageName, caption);
  }

  private sendVoiceAudio = (recipient: string, audioPath: string) => {
    this.client.sendVoice(recipient, audioPath);
  }

  private sendFile = (recipient: string, filePath: string, fileName: string, caption: string = 'Caption') => {
    this.client.sendFile(recipient, filePath, fileName, caption);
  }

  private sendLocation = (recipient: string, latitude: string, longitude: string, title: string = 'Location') => {
    this.client.sendLocation(recipient, latitude, longitude, title);
  }

  private sendImageAsSticker = (recipient: string, imagePath: string) => {
    this.client.sendImageAsSticker(recipient, imagePath);
  }

  private sendGifAsAnimatedSticker = (recipient: string, gifPath: string) => {
    this.client.sendImageAsStickerGif(recipient, gifPath);
  }

  private sendVideoAsAnimatedSticker = (recipient: string, videoPath: string, videoName: string, caption: string = 'Caption') => {
    this.client.sendVideoAsGif(recipient, videoPath, videoName, caption);
  }
}

export { Casioh };
