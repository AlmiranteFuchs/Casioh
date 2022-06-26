import { CommandModel } from "../Modal/CommandModel";
import { HelloWorldCommand } from "../Commands/HelloWorld";
import { params_to_command } from "../Modal/keyTreatment";
import { EveryoneCommand } from "../Commands/Everyone";
import { HelpCommand } from "../Commands/Help";
import { SpottedCommand } from "../Commands/Spotted";
import { RollDiceCommand } from "../Commands/Roll";
import { AdminShellCommand } from "../Commands/AdminShell";
import { MoneyToRuCommand } from "../Commands/MoneyToRu";
import { RuMenuCommand } from "../Commands/RuMenu";

const _ = require("lodash");

class CommandsController {
  constructor(public Commands_list: Array<CommandModel>) {}

  public async Run_command(
    user_access_level: number,
    params: params_to_command
  ): Promise<void> {
    let trigger_key: string = params.command_key!;
    let command: CommandModel = _.find(
      this.Commands_list,
      function (el: CommandModel) {
        return el.key == trigger_key;
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
  }
}

export class CommandsControllerService {
  private static _commands_array: Array<CommandModel>;
  private _command_hello: CommandModel;
  private _command_everyone: EveryoneCommand;
  private _command_help: HelpCommand;
  private _command_spotted: SpottedCommand;
  private _command_roll: RollDiceCommand;
  private _command_shell: AdminShellCommand;
  private _command_moneyToRu: MoneyToRuCommand;
  private _command_ruMenu: RuMenuCommand;

  public Command_service: CommandsController;

  constructor() {
    CommandsControllerService._commands_array = [];

    this._command_hello = new HelloWorldCommand();
    this._command_everyone = new EveryoneCommand();
    this._command_help = new HelpCommand();
    this._command_spotted = new SpottedCommand();
    this._command_roll = new RollDiceCommand();
    this._command_shell = new AdminShellCommand();
    this._command_moneyToRu = new MoneyToRuCommand();
    this._command_ruMenu = new RuMenuCommand();

    CommandsControllerService._commands_array.push(this._command_hello);
    CommandsControllerService._commands_array.push(this._command_everyone);
    CommandsControllerService._commands_array.push(this._command_help);
    CommandsControllerService._commands_array.push(this._command_spotted);
    CommandsControllerService._commands_array.push(this._command_roll);
    CommandsControllerService._commands_array.push(this._command_shell);
    CommandsControllerService._commands_array.push(this._command_moneyToRu);
    CommandsControllerService._commands_array.push(this._command_ruMenu);

    this.Command_service = new CommandsController(
      CommandsControllerService._commands_array
    );
  }

  static Get_commands_list(): any {
    return CommandsControllerService._commands_array;
  }
}

