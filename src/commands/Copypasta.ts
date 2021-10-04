import { CommandInterface, Option } from "./CommandInterface";

class Copypasta implements CommandInterface {
  name = 'copypasta';
  aliases = ['cp'];

  options = [
    {
      name: 'default',                // /copypasta americo
      parameters: 1,
    },
    {
      name: 'create',                // /copypasta create hoefel eu acredito em hoefel
      parameters: 2,
    },
    {
      name: 'delete',               // /copypasta delete americo
      parameters: 1,
    }
  ]

  onCommand = args => {
    return 'abc';
  }

  onCommandCreate = (name, text) => {

  }

  onCommandDelete = name => {

  }
}

export { Copypasta };
