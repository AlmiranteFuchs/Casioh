import { CommandModel } from "../Modal/CommandModel";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IMessage_format } from "../Modal/MessageModel";

export class SpottedCommand extends CommandModel {
    protected _active: boolean = false;
    protected _hidden: boolean = false;
    protected _name: string = "/spotted";
    protected _description: string = "Redireciona uma mensagem anônimamente para o grupo do Spotted";
    protected _key: string = "spotted";
    protected _access_level: number = 4;
    protected _word_min_size: number = 5;
    protected _spotted_group_id: string = "120363023365772349@g.us";


    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Spotted!");
        let payload: object = {};

        // FIXME: fix this
        return;

        //FIXME: lazy fix, add remove from help option on every command!
        if (params!.text == `/spotted\n${this._description}`) {
            return;
        }
        if (!(params!.isFrom_group)) {
            if (params!.command_params!.join()!.length > this._word_min_size) {
                //Send to GP
                try {
                    let random_id: number = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                    let spotted_message: string = params!.text!.replace("/spotted", "");

                    axios.post('http://localhost:5000/add_spotted', {
                        message: spotted_message
                    })
                        .then((response: any) => {
                            payload = { 'text_reply': "Enviei para o visualizer da festa!" };
                            console.log("festa ok");
                        }, (error: any) => {
                            payload = { 'text_reply': "Não consegui enviar para a festa!" };
                            console.log(error);
                        });

                    spotted_message = `_Novo Spotted ${random_id}#:_\n ${spotted_message}`;

                    await params?.client_name
                        .send_message(this._spotted_group_id, spotted_message, null)
                        .then(() => {
                            payload = { 'text_reply': "Encaminhado anônimamente para o spotted! \u{1F608}, apagarei nossa conversa para ficar em segredo \u{1F92B}" };
                            console.log('Spotted enviado!'); //return object success
                        })
                        .catch((erro: any) => {
                            payload = { 'text_reply': "Hum... algum erro rolou... avisa o adm ai \u{1F625}" };
                            console.error('Error when sending: ', erro); //return object error
                        });
                    await params?.client_name.deleteChat(params!.from)
                        .then(() => {
                        })
                        .catch(() => {
                            payload = { 'text_reply': "Hum... eu não consegui apagar nosso chat... \u{1F625}" };
                        });
                } catch (error: any) {
                    payload = { 'text_reply': "Hum... algum erro rolou... avisa o adm ai \u{1F625}" };
                    console.error('Error when sending: ', error); //return object error
                }
            } else {
                payload = { 'text_reply': "Sua mensagem é pequenina, mixuruca demais... \u{1F90F} aumente um pouco ela!, detalhes meu povo!" };
            }
        } else {
            payload = { 'text_reply': "Acho que... usar o comando em um grupo quebra a ideia fundamental de um spotted... mande em meu DM! \u{1F923}" };
        }


        //Reply
        try {
            params!.specific = payload;

            
        } catch (error: any) {
            console.log("Erro em Spotted, Reply: ", error);
        }

    }


}