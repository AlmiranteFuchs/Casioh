import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class LaEleCommand extends CommandModel {
    protected _key: string = "laele";
    protected _name: string = "/laele";
    protected _alias: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "LÁ ELE!";
    protected _access_level:number = 0;
    protected _active:boolean = true;
    protected _hidden:boolean = true;
    protected _limitedUse:boolean = false;
    protected _useLimit:number = 0;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando LÁ ELE!");

        try {
            const min = 2;
            const max = 10;
            let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            
            // write "LÁ ELE n vezes" where n is a random number between 1 and 100
            let reply = "LÁ ELE " + randomNum;

            // generate a random number between 0 and 1
            (Math.round(Math.random()) + 1) % 2  ? reply += " mil" : reply += "";
            
            reply += " vezes!";

            params?.client_name.send_message(params?.id, reply, params);

        } catch (error) {
            console.log("Error in terms command: " + error);
        }
    }

}