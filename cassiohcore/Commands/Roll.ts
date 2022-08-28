import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

export class RollDiceCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/roll ( 1d1...10d10 )";
    protected _description: string = "Roda dados!";
    protected _key: string = "roll";
    protected _access_level: number = 4;

    protected async execute_command(params?: params_to_command): Promise<void> {
        console.log("Rodando Roll!");
        try {
            var dices: string = (params as any).command_params[0];

            if (!dices) {
                let payload: object = { 'text_reply': "Amigão esse comando precisa de um parâmetro e eu não encontrei \u{1F625}" };
                params!.specific = payload;
                let command_result = new SendReplyCommand().Exec_command(0, params);
                return;
            }

            var times: number = parseInt(dices.split("d")[0]);
            var dice: number = parseInt(dices.split("d")[1]);

            if (times && times <= 10 && times >= 0 && dice && dice <= 100 && dice >= 0) {
                for (let i = 0; i < times; i++) {
                    let roll: number = Math.floor(Math.random() * dice) + 1;

                    let payload: object = { 'text_reply': `_Rolando 🎲 #${i} (${times}d${dice}):_ *${roll}*` };
                    params!.specific = payload;
                    let command_result = new SendReplyCommand();
                    await command_result.Exec_command(0, params);

                }
                return;
            }

            let payload: object = { 'text_reply': "Algo deu errado... Muitas coisas poderiam dar errado... òh ceus... \u{1F625}" };
            params!.specific = payload;
            let command_result = new SendReplyCommand().Exec_command(0, params);

        } catch (error) {
            console.log("Erro em Hello: ", error);
        }
    }


}