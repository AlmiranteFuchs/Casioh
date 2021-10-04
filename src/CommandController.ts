import { CommandInterface } from './commands/CommandInterface';
import { Copypasta } from './commands/Copypasta';
import { Help } from './commands/Help';

const COMMANDS = [
  Copypasta,
  Help
]

class CommandController {
  private commands: CommandInterface[] = [];

  constructor() {
    this.registerCommands();
  }

  private registerCommands = () => {
    COMMANDS.forEach(command => {
      this.commands.push(new command);
    });
  }

  getCommand = text => {
    return this.commands.filter(command => command.name === text)[0];
  }

  executeCommand = (command, args) => {
    command.onCommand(args);
  }
}

export { CommandController };
