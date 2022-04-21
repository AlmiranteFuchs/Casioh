import { CommandsControllerService } from "./cassiohcore/Controller/CommandsController";
import { KeyTreatment, params_to_command } from "./cassiohcore/Modal/keyTreatment";
const venom = require('venom-bot');

const command_service = new CommandsControllerService().Command_service;
//command_service.Run_command('olá',0);
const commandStart: string = '/';

venom
    .create({
        session: 'CassiohV2',   // name of session
    })
    .then((client: any) => start(client))
    .catch((erro: any) => {
        console.log(erro);
    });

function start(client: any) {
    client.onMessage((message: any) => {
        let key: string = message.body.split(" ")[0].toLowerCase();
        let params: params_to_command = KeyTreatment.Params_command(client, message);

        params.command_key_raw?.startsWith("/") ? command_service.Run_command(0, params) : "";
    });
}