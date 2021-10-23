import { Timestamp } from '@firebase/firestore';
import { Message } from 'venom-bot';
import { Casioh } from '../Casioh';
import { deleteDocument, setDocument } from '../database/utils';
import { CommandInterface } from './CommandInterface';
import { getCommandData } from './utils';

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
  ];

  onCommand = async (args, message: Message) => {
    try {
      const option = args[0];

      if (option === 'create') {
        const name = args[1];
        const text = args.slice(2).join(' ');
        this.onCommandCreate(name, text, message);
        return;
      } else if (option === 'delete') {
        const name = args[1];
        this.onCommandDelete(name, message);
        return;
      }

      const data = await this.getCopypastaData(option);

      if (data) {
        const text  = data.text.replace(/\\n/g, '\n');

        const responseController = Casioh.getInstance().getResponseController();
        responseController.sendText(message.from, text);
      }
    } catch (e) {
      console.log(e);
    }
  }

  onCommandCreate = async (name, text, message: Message) => {
    const data = await this.getCopypastaData(name);

    if (data) {
      const response = 'Ja existe uma copypasta com este nome.';
      const responseController = Casioh.getInstance().getResponseController();
      responseController.sendText(message.from, response);
      return;
    }

    const path = `commands/copypastas/copypastas/${name}`;
    const docData = {
      creationDate: Timestamp.fromDate(new Date()),
      creator: message.author.replace('@c.us', ''),
      text
    };

    await setDocument(path, docData);

    const response = 'Copypasta adicionada com sucesso.';
    const responseController = Casioh.getInstance().getResponseController();
    responseController.sendText(message.from, response);
  }

  onCommandDelete = async (name, message: Message) => {
    const data = await this.getCopypastaData(name);

    if (!data) {
      const response = 'Nao existe uma copypasta com este nome.';
      const responseController = Casioh.getInstance().getResponseController();
      responseController.sendText(message.from, response);
      return;
    }

    const path = `commands/copypastas/copypastas/${name}`;
    await deleteDocument(path);

    const response = 'Copypasta removida com sucesso.';
    const responseController = Casioh.getInstance().getResponseController();
    responseController.sendText(message.from, response);
  }

  async getCopypastaData(name) {
    const command = `copypastas/copypastas/${name}`;
    const data = await getCommandData(command);
    return data;
  }
}

export { Copypasta };
