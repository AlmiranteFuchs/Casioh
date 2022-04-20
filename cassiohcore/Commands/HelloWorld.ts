import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";

export class HelloWorldCommand extends CommandModel {
    protected _key: string = "olá";
    protected _access_level: number = 4;

    protected execute_command(params?: params_to_command): void {
        console.log("Rodando Hello!");

        params?.client.sendText(params?.from, '👋 Hello from venom!')
            .then((result: any) => {
                console.log('Result: ', " executado"); //return object success
            })
            .catch((erro: any) => {
                console.error('Error when sending: ', erro); //return object error
            });
        //params!.client.reply(params!.from, "Olá jovem!", params!.id!.toString());
    }


}