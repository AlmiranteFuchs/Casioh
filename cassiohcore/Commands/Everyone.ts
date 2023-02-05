import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class EveryoneCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _options?: string[] | undefined = undefined;
    protected _name: string = "/everyone";
    protected _description: string = "Pinga todos os amiguinhos do grupo";
    protected _key: string = "everyone";
    protected _alias?= undefined;
    protected _access_level: number = 3;
    protected _limitedUse: boolean = true;
    protected _useLimit: number = 2;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Everyone!");
        try {
            if (!params?.isFrom_group) {
                let payload: string = "Oh meu lindo, como que eu vou chamar todos se só tem eu e você aqui gênio?";

                params!.specific.reply = true
                params?.client_name.send_message(params?.id, payload, params);
                return;
            }

            let payload: string = "Okay, chamando todos os bonitos";
            params!.specific.reply = true;
            params?.client_name.send_message(params?.id, payload, params);

            let user_ids: Array<any> = [];
            let message: string = "";

            user_ids = await params?.client_name.get_group_members(params?.id);

            message = params?.sender_name + " solicitou uma reunião dos cornos.\n";

            params!.specific.mention = true;
            params!.specific.reply = true;

            params!.specific.mentions = user_ids;

            for (let i = 0; i < user_ids.length; i++) {
                message += "@" + user_ids[i].split("@")[0] + " ";
            }

            params?.client_name.send_message(params?.id, message, params);

        } catch (error) {
            console.log("Erro em Everyone: ", error);
        }
    }


}