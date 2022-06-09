import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";

export class SendText extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _name: string = "/sendTxt";
    protected _description: string = "admin tool";
    protected _key: string = "/sendTxt";
    protected _access_level: number = 0;

    protected execute_command(params?: params_to_command): void {
        console.log("Rodando sendTxt");
        params?.client
            .sendText(params?.specific?.text_receiver, params?.specific?.text_reply)
            .then((result: any) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro: any) => {
                console.error('Error when sending: ', erro); //return object error
            });
    }


}