import axios from "axios";
import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

export class MoneyToRuCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/mru";
    protected _description: string = "Converte uma cotação para RU's \u{1F625}, _ex: /mru USD 5_ converte 5 dólares para RU's ";
    protected _key: string = "mru";
    protected _access_level: number = 4;

    protected async execute_command(params?: params_to_command): Promise<void> {
        console.log(`Rodando ${this._name}`);

        //Default error message 
        let text: string = "Amigão parâmetros faltam ai vou dizer nada não... Ou erro em algo ai sei lá";

        const ru_price: number = 1.30;

        try {
            var coin: string = (params as any).command_params[0]?.toUpperCase() ?? null;
            var amount: number = parseInt((params as any).command_params[1]) ?? 1;

            if (coin) {

                if (coin != "BRL") {
                    await axios.get(`http://economia.awesomeapi.com.br/json/last/${coin}-BRL`).then((data: any) => {
                        try {
                            if (data.status = 200) {
                                let price: number = parseFloat(data.data[`${coin}BRL`]['high']);
                                price = price * amount;

                                let rus: number = price / ru_price;
                                rus = +rus.toFixed(2);

                                text = `Você consegue ${rus} RU's com ${amount} ${coin}`;
                            }

                        } catch (error: any) {
                            console.log(`Error em ${this._name}`);
                            text = `Ops... algo acontece... veja ai: ${error}`;
                        }


                    }).catch((error: any) => {
                        console.log(`Error em ${this._name}`);
                        text = `Ops... algo acontece... veja ai: ${error}`;
                    })
                } else {
                    let price: number = 1;
                    price = price * amount;

                    let rus: number = price / ru_price;
                    rus = +rus.toFixed(2);

                    text = `Você consegue ${rus} RU's com ${amount} ${coin}`;
                }
            }



            let payload: object = { 'text_reply': text };
            params!.specific = payload;

            let command_result = new SendReplyCommand().Exec_command(0, params);
        } catch (error) {
            console.log(`Erro em Hello: ${this._name}`, error);
        }
    }


}