import { CommandModel } from "../Modal/CommandModel";
import { HelloWorldCommand } from "../Commands/HelloWorld";
import { params_to_command } from "../Modal/keyTreatment";

const _ = require('lodash');

class CommandsController {
    constructor(public Commands_list: Array<CommandModel>) { }

    public Run_command(user_access_level: number, params: params_to_command): void {
        let trigger_key: string = params.command_key!;
        let command: CommandModel = _.find(this.Commands_list, function (el: CommandModel) {
            return el.key == trigger_key;
        });

        if (command) {
            let command_result = command.Exec_command(user_access_level, params);
            command_result ? console.log("Executado com sucesso") : console.log("Algo de errado aconteceu");
            return;
        }
        console.log("Comando não encontrado");
    }
}

export class CommandsControllerService {
    private _commands_array: Array<CommandModel>;
    private _command_hello: CommandModel;

    public Command_service: CommandsController;

    constructor() {
        this._commands_array = [];

        this._command_hello = new HelloWorldCommand();
        this._commands_array.push(this._command_hello);


        this.Command_service = new CommandsController(this._commands_array);
    }
}