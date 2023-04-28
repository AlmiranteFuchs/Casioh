import { CommandsControllerService } from "../Controller/CommandsController";
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class HelpCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _options?: string[] | undefined = undefined;
    protected _name: string = "!help";
    protected _description: string = "Mostra a tabela de comandos disponíveis";
    protected _key: string = "help";
    protected _alias: string = "h";
    protected _access_level: number = 4;
    protected _limitedUse: boolean = false;
    protected _useLimit: number = 0;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Help!");
        try {
            let all_commands: Array<CommandModel> = CommandsControllerService.Get_commands_list();
            let rowss: Array<any> = [];
            all_commands.forEach((comando: CommandModel) => {
                if (!comando.hidden && comando.active)
                    rowss.push({ title: comando.name, description: comando.description, alias: comando.alias, useLimit: comando.useLimit });
            });

            params?.client_name.send_message(params!.chat_id!,
                "_*Comandos disponíveis para uso geral:*_ \n" +
                rowss.map((row: any) =>
                    "_*" + row.title + (row.alias != undefined ? (" ou /" + row.alias) : "") + "*_" +
                    (row.useLimit > 0 ? (" *Usos:* " + row.useLimit) : "") + "\n" +
                    " - " + row.description + "\n").join("\n") +
                "\n\n_Caadsioh, versão v1_\n_https://github.com/AlmiranteFuchs/Casioh/tree/Caadsioh_", params);
        } catch (error) {
            console.log("Erro em Help: ", error);
        }
    }


}