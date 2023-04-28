import { CommandModel } from "../Modal/CommandModel";
import { HelpCommand } from "../Commands/Help";
import { IMessage_format } from "../Modal/MessageModel";
import { RestartCommand } from "../Commands/Restart";
import { LockersCommand } from "../Commands/Lockers";

const _ = require("lodash");

class CommandsController {
  constructor(public Commands_list: Array<CommandModel>) { }

  public async Run_command(
    user_access_level: number,
    params: IMessage_format
  ): Promise<void> {
    let trigger_key: string = params.command_key!;
    let command: CommandModel = _.find(
      this.Commands_list,
      function (el: CommandModel) {
        return el.key == trigger_key || el.alias == trigger_key;
      }
    );

    if (command) {
      let command_result = await command.Exec_command(
        user_access_level,
        params
      );
      command_result
        ? console.log("Executado com sucesso")
        : console.log("Algo de errado aconteceu");
      return;
    }
    console.log("Comando não encontrado");

    // Bad pratice
    params?.client_name.send_message(params!.chat_id!, "Perdão, não entendi o que quer dizer, use !help para consultar comandos");
  }
}

export class CommandsControllerService {
  private static _commands_array: Array<CommandModel>;
  private _command_help: HelpCommand;
  private _command_restart: RestartCommand;
  private _command_lockers: LockersCommand;

  public Command_service: CommandsController;

  constructor() {
    CommandsControllerService._commands_array = [];

    this._command_help = new HelpCommand();
    this._command_restart = new RestartCommand();
    this._command_lockers = new LockersCommand();

    CommandsControllerService._commands_array.push(this._command_help);
    CommandsControllerService._commands_array.push(this._command_restart);
    CommandsControllerService._commands_array.push(this._command_lockers);

    this.Command_service = new CommandsController(
      CommandsControllerService._commands_array
    );
  }

  static Get_commands_list(): any {
    return CommandsControllerService._commands_array;
  }
}

