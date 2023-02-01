import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class RollDiceCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/roll ( 1d1...10d10 )";
    protected _description: string = "Roda dados!";
    protected _key: string = "roll";
    protected _access_level: number = 4;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Roll!");
        try {
            var dices: string = (params as any).command_params[0];
            if (!dices) {

                let text = "Amigão esse comando precisa de um parâmetro e eu não encontrei \u{1F625}";

                params?.client_name.send_message(params?.id, text, params);
                return;
            }

            var times: number = parseInt(dices.split("d")[0]);
            var dice: number = parseInt(dices.split("d")[1]);

            if (times && times <= 10 && times >= 0 && dice && dice <= 100 && dice >= 0) {
                let text = "";
                for (let i = 0; i < times; i++) {
                    let roll: number = Math.floor(Math.random() * dice) + 1;

                    text += `_Rolando 🎲 #${i + 1} (${times}d${dice}):_   *${roll}*\n`;


                }

                params?.client_name.send_message(params?.id, text, params);
                return;
            }

            let text = "Algo deu errado... Muitas coisas poderiam dar errado... òh ceus... \u{1F625}";

            params?.client_name.send_message(params?.id, text, params);

        } catch (error) {
            console.log("Erro em Hello: ", error);
        }
    }


}