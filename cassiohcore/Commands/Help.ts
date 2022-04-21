import { CommandsControllerService } from "../Controller/CommandsController";
import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

const version = require('../package.json').version;

export class HelpCommand extends CommandModel {
    protected _name: string = "/help";
    protected _description: string = "Wow, o que será que ele faz???";
    protected _key: string = "help";
    protected _access_level: number = 4;

    protected execute_command(params?: params_to_command): void {
        console.log("Rodando Help!");
        try {
            let all_commands: Array<CommandModel> = CommandsControllerService.Get_commands_list();
            let message: string = "_Olá meu chapa tudo certo? A lista de comandos é essa:_ \n \n";
            all_commands.forEach((comando: CommandModel) => {
                message += `*${comando.name}* : _${comando.description}_ Lvl: ${comando.access_level} \n`;
            });
            message += `\n _C.omputed A.S.S.isted I.nput O.utput H.elper_ versão: _${version}_ `;

            let payload: object = { 'text_reply': message };
            params!.specific = payload;

            let command_result = new SendReplyCommand().Exec_command(0, params);
        } catch (error) {
            console.log("Erro em Help: ", error);
        }
    }


}