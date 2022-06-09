import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";

export class SendReplyCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _name: string = "";
    protected _description: string = "";
    protected _key: string = "";
    protected _access_level: number = 4;

    protected async execute_command(params?: params_to_command): Promise<void> {
        await params?.client.reply(
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