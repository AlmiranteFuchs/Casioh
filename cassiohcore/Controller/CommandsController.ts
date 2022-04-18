import { CommandModel } from "../Modal/CommandModel";
const _ = require('lodash');

export class CommandsControllerService {
    constructor(public Commands_list: Array<CommandModel>) { }

    public Run_command(trigger_key: string, user_access_level: number): void {
        let command: CommandModel = _.find(this.Commands_list, function (el: CommandModel) {
            return el.key == trigger_key;
        });

        if (command) {
            let command_result = command.Exec_command(user_access_level);
            command_result ? console.log("Executado com sucesso") : console.log("Algo de errado aconteceu");
            return;
        }
        console.log("Comando não encontrado");
    }
}