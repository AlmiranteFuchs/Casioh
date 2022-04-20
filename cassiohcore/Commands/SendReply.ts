import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";

export class SendReplyCommand extends CommandModel {
    protected _key: string = "";
    protected _access_level: number = 4;

    protected execute_command(params?: params_to_command): void {
        params?.client.reply(
            params?.from,
            params?.specific?.text_reply,
            params?.id
        ).then(() => {
            console.log('Result: ', "executado"); //return object success
        }).catch((erro: any) => {
            console.error('Error when sending: ', erro); //return object error
        });
    }


}