import { Casioh } from '../Casioh';
import { CommandInterface } from './CommandInterface';
import { getCommandData } from './utils';

class Help implements CommandInterface {
  name = 'help';
  aliases = ['h'];

  options = [
    {
      name: 'default',
      parameters: 0,
    }
  ];

  onCommand = async (args, message) => {
    try {
      const text = await this.getHelpText();

      const responseController = Casioh.getInstance().getResponseController();
      responseController.sendText(message.from, text);
    } catch (e) {
      console.log(e);
    }
  }

  async getHelpText(): Promise<string> {
    const data = await getCommandData('help');
    return data ? data.text : 'ERROR';
  }
}

export { Help };
