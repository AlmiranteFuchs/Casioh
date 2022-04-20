import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";

export class SendText extends CommandModel {
    protected _key: string = "/sendTxt";
    protected _access_level: number = 4;

    protected execute_command(params?: params_to_command): void {
        console.log("Aha Olá!!");
        /* params?.client
            .sendText('000000000000@c.us', '👋 Hello from venom!')
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            }); */
    }


}