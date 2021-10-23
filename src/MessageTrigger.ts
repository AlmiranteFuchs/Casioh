import { Message, Whatsapp } from 'venom-bot';
import { CommandController } from './CommandController';

const fs = require('fs');

const COMMAND_START = '/';

class MessageTrigger {
  client: Whatsapp;
  commandController: CommandController;

  constructor(client: Whatsapp, commandController: CommandController) {
    this.commandController = commandController;
    this.client = client;
  }

  processMessage = (message: Message) => {
    const isImage = message.isMedia || message.isMMS;
    let messageText: string = isImage ? message.caption : message.body;
    messageText = messageText.replace('Nenhum comando encontrado com isso ai chapa', '/help');

    if (messageText.startsWith(COMMAND_START)) {
      this.triggerCommand(messageText, message);
      return;
    }

    this.triggerNaturalText(messageText);
  }

  triggerCommand = (text: string, message: Message)  => {
    const splitText = text.split(' ');

    const commandText = splitText[0].replace('/', '');
    const command = this.commandController.getCommand(commandText);

    const hasPermission = true;

    if (!command || !hasPermission) return null;

    splitText.shift();
    const args = splitText;

    this.commandController.executeCommand(command, args, message);
  }

  triggerNaturalText = text => {

  }
}

export { MessageTrigger };
