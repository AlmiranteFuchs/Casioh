//Responsável por executar operações e respostas

const { Command } = require("../Modal/Command");
class CommandsController {
  constructor(client) {
    this.client = client;
  }

  //Funções:
  async exemplo() {
    let comando = new Command(2);
    if (comando.checkLevelAccess(0)) {
      console.log("Sim");
    } else {
      console.log("Não");
    }
  }
  //Funções END:
}
module.exports = { CommandsController };
