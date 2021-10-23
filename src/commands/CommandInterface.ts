import { Message } from 'venom-bot';

interface CommandInterface {
  name: string;
  aliases?: string[];
  options?: Option[];
  helpDescription?: string;

  onCommand(args: string[], message: Message);
}

interface Option {
  name: string;
  parameters: number;
  aliases?: string[];
  helpDescription?: string;
}

export { CommandInterface, Option };
