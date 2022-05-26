import { SendText } from "./cassiohcore/Commands/SendText";
import { params_to_command } from "./cassiohcore/Modal/keyTreatment";

async function init() {

    const WebSocket = require('ws');


    let caad = new WebSocket('https://caad.inf.ufpr.br/api/ws');

    caad.on('open', function connection() {
        caad.send(JSON.stringify({ "method": "login", "secret": process.env.CAAD_PWS }));
        console.log("Conectado ao CAAD com sucesso!");

        caad.on('message', (msg: any) => {
            console.log(`Nova mensagem do CAAD: ${msg}`);
            responses(msg, caad);
        });
    });

    // Imprimi "Hello!" duas vezes, um para cada caade
}

function responses(response: any, websocket: any): void {
    let cassioh_message: string = "Não compreendi";
    let cassioh_status: number = 500;


    if (response?.method == "sendReceipt") {
        //Pede pra enviar mensagem
        if (response?.message != undefined && response?.phone != undefined) {
            try {
                let params: params_to_command = { "specific": { "text_receiver": response?.phone, "text_reply": response?.message } };
                let cassioh_call: SendText = new SendText();

                let call_response = cassioh_call.Exec_command(0, params);
                console.log(call_response);
                
            } catch (error:any) {

            }
        } else {
            cassioh_message = "Meu bom, tu me passou parâmetro errado, lmao";
            cassioh_status = 404;
        }
    }

    let cassioh_response: object = { 'message': cassioh_message, 'status': cassioh_status };
    websocket?.send(JSON.stringify({ cassioh_response }));
}
init();