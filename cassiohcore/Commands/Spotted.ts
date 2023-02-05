import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class SpottedCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/spotted";
    protected _description: string = "Redireciona uma mensagem anônimamente para o grupo do Spotted";
    protected _key: string = "spotted";
    protected _alias = undefined;
    protected _access_level: number = 4;
    protected _word_min_size: number = 5;
    protected _limitedUse = false;
    protected _useLimit = 0;

    // Specific command properties
    protected _spotted_group_id: string = "120363023365772349@g.us";
    protected _session_spotted_number: number = 0;


    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Spotted!");

        try {



            // Check if the user sent this on a group
            if (params?.isFrom_group) {
                params?.client_name.send_message(params?.id, "Brother... Tu quer mesmo mandar spotted publico? Qual o sentido?? 🤨");
                return;
            }

            // Check if the user sent a message
            if (params?.command_params?.length == 0) {
                params?.client_name.send_message(params?.id, "Tu quer que eu imagine o que tu quer mandar ou o que doido? 🤨");
                return;
            }

            // Check if the user sent a message with more than 5 words
            if ((params?.command_params!).length < this._word_min_size) {
                params?.client_name.send_message(params?.id, "Bora caprichar em algo maior não? To com preguiça de enviar essa mensagem mixuruca 🤨");
                return;
            }

            // Else send the message to the spotted group
            let message_to_send = "_*Novo Spotted!:*_# "+(this._session_spotted_number++)+"\n" + params?.command_params?.join(" ");
            params?.client_name.send_message(this._spotted_group_id, message_to_send);
            params?.client_name.send_message(params?.id, "Enviado! 😎, vou limpar o chat pra você não ficar com vergonha 😏");

        } catch (error) {
            console.log("Erro ao enviar spotted");
            params?.client_name.send_message(params?.id, "Consegui não.. 😔");
        }

        // Clears the chat
        try {
            params?.client_name.clear_chat(params);
        } catch (error) {
            console.log("Erro ao limpar o chat do Spotted");
            params?.client_name.send_message(params?.id, "Não consegui limpar meu chat, se importa em apagar você mesmo?");
        }
        return;

    }


}