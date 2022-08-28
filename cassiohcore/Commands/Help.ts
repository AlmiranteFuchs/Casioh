import { CommandsControllerService } from "../Controller/CommandsController";
import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

export class HelpCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/help";
    protected _description: string = "Wow, o que será que ele faz???";
    protected _key: string = "help";
    protected _access_level: number = 4;

    protected async execute_command(params?: params_to_command): Promise<void> {
        console.log("Rodando Help!");
        try {
            let all_commands: Array<CommandModel> = CommandsControllerService.Get_commands_list();
            let rowss: Array<any> = [];
            all_commands.forEach((comando: CommandModel) => {
                if (!comando.hidden && comando.active)
                    rowss.push({ title: comando.name, description: comando.description });
            });

            const list = [
                {
                    title: "Comandos utilizáveis!",
                    rows: rowss
                }
            ];
            await params?.client.sendListMenu(
                params?.from,
                "{ -- *_Lista de comandos V2_* -- }",
                "subTitle",
                "_Comandos disponíveis para uso geral_",
                "Abrir..",
                list
            ).then(() => {
                console.log('Result: ', "executado"); //return object success
            }).catch((erro: any) => {
                console.error('Error when sending: ', erro); //return object error
            });

        } catch {

        }

    }


}