import { CommandModel } from "../Modal/CommandModel";
import { HelloWorldCommand } from "../Commands/HelloWorld";
import { EveryoneCommand } from "../Commands/Everyone";
import { HelpCommand } from "../Commands/Help";
import { SpottedCommand } from "../Commands/Spotted";
import { RollDiceCommand } from "../Commands/Roll";
import { AdminShellCommand } from "../Commands/AdminShell";
import { MoneyToRuCommand } from "../Commands/MoneyToRu";
import { RuMenuCommand } from "../Commands/RuMenu";
import { IMessage_format } from "../Modal/MessageModel";
import { CopypastaCommand } from "../Commands/Copypasta";
import { StickerCommand } from "../Commands/Sticker";
import { TextToSpeechCommand } from "../Commands/TextToSpeech";
import { SpeechToTextCommand } from "../Commands/SpeechToText";
import { ChatGPTCommand } from "../Commands/ChatGPT";
import { InfoCommand } from "../Commands/Credits";
import { TermsCommand } from "../Commands/Terms";

const _ = require("lodash");

class CommandsController {
  constructor(public Commands_list: Array<CommandModel>) {}

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
  }
}

export class CommandsControllerService {
  private static _commands_array: Array<CommandModel>;
  private _command_hello: CommandModel;
  private _command_everyone: EveryoneCommand;
  private _command_help: HelpCommand;
  private _command_spotted: SpottedCommand;
  private _command_roll: RollDiceCommand;
  //private _command_shell: AdminShellCommand;
  private _command_moneyToRu: MoneyToRuCommand;
  private _command_ruMenu: RuMenuCommand;
  private _command_copypasta: CopypastaCommand;
  private _command_sendSticker: StickerCommand;
  private _command_tts: TextToSpeechCommand;
  private _command_stt: SpeechToTextCommand;
  private _command_chatGPT: ChatGPTCommand;
  private _command_info: InfoCommand;
  private _command_terms: TermsCommand;

  public Command_service: CommandsController;

  constructor() {
    CommandsControllerService._commands_array = [];

    this._command_hello = new HelloWorldCommand();
    this._command_everyone = new EveryoneCommand();
    this._command_help = new HelpCommand();
    this._command_spotted = new SpottedCommand();
    this._command_roll = new RollDiceCommand();
    //this._command_shell = new AdminShellCommand();
    this._command_moneyToRu = new MoneyToRuCommand();
    this._command_ruMenu = new RuMenuCommand();
    this._command_copypasta = new CopypastaCommand();
    this._command_sendSticker = new StickerCommand();
    this._command_tts = new TextToSpeechCommand();
    this._command_stt = new SpeechToTextCommand();
    this._command_chatGPT = new ChatGPTCommand();
    this._command_info = new InfoCommand();
    this._command_terms = new TermsCommand();

    CommandsControllerService._commands_array.push(this._command_hello);
    CommandsControllerService._commands_array.push(this._command_everyone);
    CommandsControllerService._commands_array.push(this._command_help);
    CommandsControllerService._commands_array.push(this._command_spotted);
    CommandsControllerService._commands_array.push(this._command_roll);
    //CommandsControllerService._commands_array.push(this._command_shell);
    CommandsControllerService._commands_array.push(this._command_moneyToRu);
    CommandsControllerService._commands_array.push(this._command_ruMenu);
    CommandsControllerService._commands_array.push(this._command_copypasta);
    CommandsControllerService._commands_array.push(this._command_sendSticker);
    CommandsControllerService._commands_array.push(this._command_tts);
    CommandsControllerService._commands_array.push(this._command_stt);
    CommandsControllerService._commands_array.push(this._command_chatGPT);
    CommandsControllerService._commands_array.push(this._command_info);
    CommandsControllerService._commands_array.push(this._command_terms);

    this.Command_service = new CommandsController(
      CommandsControllerService._commands_array
    );
  }

  static Get_commands_list(): any {
    return CommandsControllerService._commands_array;
  }
}

