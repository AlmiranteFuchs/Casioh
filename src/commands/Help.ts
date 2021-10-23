import { Casioh } from '../Casioh';
import { CommandInterface } from './CommandInterface';

class Help implements CommandInterface {
  name = 'help';
  aliases = ['h'];

  options = [
    {
      name: 'default',
      parameters: 0,
    }
  ];

  onCommand = (args, message) => {
    const responseController = Casioh.getInstance().getResponseController();
    responseController.sendText(message.from, 'HELP MESSAGE');
  }
}

export { Help };
