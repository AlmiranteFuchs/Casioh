import { Whatsapp } from 'venom-bot';

class ResponseController {

  client: Whatsapp;

  constructor(client: Whatsapp) {
    this.client = client;
  }

  public sendText = (recipient: string, text: string) => {
    this.client.sendText(recipient, text);
  }

  public sendTextTagged = (recipient: string, text: string, taggeds: string[]) => {
    this.client.sendMentioned(recipient, text, taggeds);
  }

  public sendTextReplyToMessage = (recipient: string, text: string, quotedMessageId: string) => {
    this.client.reply(recipient, text, quotedMessageId);
  }

  public sendTextLinkPreview = (recipient: string, url: string, title: string) => {
    this.client.sendLinkPreview(recipient, url, title);
  }

  public sendImage = (recipient: string, imagePath: string, imageName: string, caption: string = 'Caption') => {
    this.client.sendImage(recipient, imagePath, imageName, caption);
  }

  public sendVoiceAudio = (recipient: string, audioPath: string) => {
    this.client.sendVoice(recipient, audioPath);
  }

  public sendFile = (recipient: string, filePath: string, fileName: string, caption: string = 'Caption') => {
    this.client.sendFile(recipient, filePath, fileName, caption);
  }

  public sendLocation = (recipient: string, latitude: string, longitude: string, title: string = 'Location') => {
    this.client.sendLocation(recipient, latitude, longitude, title);
  }

  public sendImageAsSticker = (recipient: string, imagePath: string) => {
    this.client.sendImageAsSticker(recipient, imagePath);
  }

  public sendGifAsAnimatedSticker = (recipient: string, gifPath: string) => {
    this.client.sendImageAsStickerGif(recipient, gifPath);
  }

  private sendVideoAsAnimatedSticker = (recipient: string, videoPath: string, videoName: string, caption: string = 'Caption') => {
    this.client.sendVideoAsGif(recipient, videoPath, videoName, caption);
  }
}

export { ResponseController };
