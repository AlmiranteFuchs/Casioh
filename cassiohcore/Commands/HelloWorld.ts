import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class HelloWorldCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/olá";
    protected _description: string = "Só teste mesmo";
    protected _key: string = "olá";
    protected _options?: string[] | undefined = undefined;
    protected _alias = "hi";
    protected _access_level: number = 4;
    protected _limitedUse:boolean = false;
    protected _useLimit:number = 0;

    protected execute_command(params?: IMessage_format): void {
        console.log("Rodando Hello!");
        try {
            let message = "👋 Olá mundo, vasto mundo mais vasto é meu coração, mais vasto é a torcida da cruz de malta no pendão, Glória!";

            params?.client_name.send_message(params?.id, message, params);
        } catch (error) {
            console.log("Erro em Hello: ", error);
        }
    }


}