import { Message } from 'venom-bot';
import { CommandInterface } from './CommandInterface';

class Copypasta implements CommandInterface {
  name = 'copypasta';
  aliases = ['cp'];

  options = [
    {
      name: 'default',
      parameters: 1,
    },
    {
      name: 'create',
      parameters: 2,
    },
    {
      name: 'delete',
      parameters: 1,
    }
  ]

  onCommand = (args, message: Message) => {
  }

  onCommandCreate = (name, text) => {
  }

  onCommandDelete = name => {
  }
}

export { Copypasta };
