import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class EveryoneCommand extends CommandModel {
    protected _active: boolean = false;
    protected _hidden: boolean = false;
    protected _name: string = "/everyone";
    protected _description: string = "Pinga todos os amiguinhos do grupo";
    protected _key: string = "everyone";
    protected _access_level: number = 3;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Everyone!");

        // FIXME: remake 
        return;
        /* Implement you dumb bitch */
        try {
            if (!params?.isFrom_group) {
                let payload: object = { 'text_reply': "Oh meu lindo, como que eu vou chamar todos se só tem eu e você aqui gênio?" };
                params!.specific = payload;
                return;
            }

            let payload: object = { 'text_reply': "Okay, chamando todos os bonitos" };
            params!.specific = payload;

            let user_ids: Array<any> = [];
            let message: string = "";

           /*  params?.client.getGroupMembersIds(params?.from)
                .then((userIDGp: any) => {
                    userIDGp.forEach((userIDGp: any) => {
                        user_ids.push(userIDGp.user)
                        message == "" ? message = 'Atenção atenção! @' + userIDGp.user.toString() + ' ' : message = message + '@' + userIDGp.user.toString() + ' ';
                    });
                    //Capaz que seja do venom em sí e não do await, o sentMentioned é enviado antes do reply
                    setTimeout(() => {
                        params?.client.sendMentioned(params?.from, message, user_ids);
                    }, 2500);
                }); */

        } catch (error) {
            console.log("Erro em Everyone: ", error);
        }
    }


}