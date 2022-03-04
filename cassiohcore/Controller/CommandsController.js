//Responsável por executar operações e respostas

const { Command } = require("../Modal/Command");
class CommandsController {
  constructor(client) {
    this.client = client;
  }

  //Funções:

  async exemplo(userLevelAccessCommand) {
    //Commando que precisa de no mínimo nivel 2 para uso
    let comando = new Command(0);
    let base = comando.executeCommand;

    comando.executeCommand = function (userLevelAccess) {
      base.call(this, userLevelAccess);
      console.log("filho");
      //Função editavel aqui
    };

    comando.executeCommand(userLevelAccessCommand);
  }
  //Funções END:
}

const teste = new CommandsController("aaa");
teste.exemplo(7);
module.exports = { CommandsController };
