import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

export class HelloWorldCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/olá";
    protected _description: string = "Só teste mesmo";
    protected _key: string = "olá";
    protected _access_level: number = 4;

    protected execute_command(params?: params_to_command): void {
        console.log("Rodando Hello!");
        try {
            let payload: object = { 'text_reply': "👋 Olá mundo, vasto mundo mais vasto é meu coração, mais vasto é a torcida da cruz de malta no pendão, Glória!" };
            params!.specific = payload;

            let command_result = new SendReplyCommand().Exec_command(0, params);
        } catch (error) {
            console.log("Erro em Hello: ", error);
        }
    }


}