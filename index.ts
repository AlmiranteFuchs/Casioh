import { CommandsControllerService } from "./cassiohcore/Controller/CommandsController";
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
        command_service.Run_command(key, 0);
        /* if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
                .sendText(message.from, 'Welcome Venom 🕷')
                .then((result: any) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro: any) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        } */
    });
}