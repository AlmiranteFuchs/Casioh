import { SendText } from "./cassiohcore/Commands/SendText";
import { params_to_command } from "./cassiohcore/Modal/keyTreatment";

export class CaadReceipt {

    constructor(private client: any) { }


    public async init() {

        const WebSocket = require('ws');


        let caad = new WebSocket('https://caad.inf.ufpr.br/api/ws');

        caad.on('open', () => {
            caad.send(JSON.stringify({ "method": "login", "secret": process.env.CAAD_PWS }));
            console.log("Conectado ao CAAD com sucesso!");

            caad.on('message', (msg: any) => {
                console.log(`Nova mensagem do CAAD: ${msg}`);
                this.responses(msg, caad);
            });
        });

        // Imprimi "Hello!" duas vezes, um para cada caade
    }

    private async responses(response: any, websocket: any): Promise<void> {
        let cassioh_message: string = "Não compreendi";
        let cassioh_status: number = 500;

        //test
        //response = { "phone": "5544998579172@c.us", "method": "sendReceipt", "message": "message" };

        if (response?.method == "sendReceipt") {
            //Pede pra enviar mensagem
            if (response?.message != undefined && response?.phone != undefined) {
                try {
                    let params: params_to_command = { "specific": { "text_receiver": response?.phone + "@c.us", "text_reply": response?.message }, client: this.client };
                    let cassioh_call: SendText = new SendText();

                    let call_response = await cassioh_call.Exec_command(0, params);
                    console.log(call_response);
                    if (call_response) {
                        cassioh_message = "Enviado com sucesso";
                        cassioh_status = 200;
                    } else {
                        cassioh_message = "Falha em envio de mensagem";
                        cassioh_status = 500;
                    }

                } catch (error: any) {
                    console.error("Não foi possível enviar para o aluno o comprovante", error);
                    cassioh_message = "Falha em envio de mensagem";
                    cassioh_status = 500;
                }
            } else {
                cassioh_message = "Meu bom, tu me passou parâmetro errado, lmao";
                cassioh_status = 404;
            }
            let cassioh_response: object = { 'message': cassioh_message, 'status': cassioh_status };
            console.log(cassioh_response);

            websocket?.send(JSON.stringify({ cassioh_response }));
        }

    }
}
