import { CommandInterface } from "./CommandInterface";

class Help implements CommandInterface {
  name = 'help';
  aliases = ['h'];

  options = [
    {
      name: 'default',
      parameters: 0,
    }
  ]

  onCommand = args => {
    console.log('im the helper!');
    return 'abc';
  }
}

export { Help };
