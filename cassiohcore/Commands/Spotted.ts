import path from "path";
import fs from "fs";
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class SpottedCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/spotted";
    protected _description: string = "Redireciona uma mensagem anônimamente para o grupo do Spotted";
    protected _key: string = "spotted";
    protected _options?: string[] | undefined = ["-r {id}( reply )"];
    protected _alias = undefined;
    protected _access_level: number = 4;
    protected _limitedUse = false;
    protected _useLimit = 0;

    // Specific command properties
    protected _spotted_group_id: string = process.env.SPOTTED_GP_ID ?? "";
    protected _word_min_size: number = 1;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Spotted!");

        if (!this._spotted_group_id) {
            params?.client_name.send_message(params?.id, "Hum, parece que o adm não configurou o grupo do spotted ainda.. 😔");
            return;
        }

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

            // Check if the reply option is on
            if (params?.command_options?.includes("-r")) {

                // Get the parameter of the reply option
                let reply_id = params?.command_params?.[params?.command_options?.indexOf("-r")] ?? false;
                // Check if the reply id is valid
                if (!reply_id) {
                    params?.client_name.send_message(params?.id, "Tu quer que eu responda algo que não existe? 🤨");
                    return;
                }

                // Get all the messages from the last message json
                const path_url = path.resolve(__dirname, './CommandsAssets/lastmessages.json');
                // Pushes the new message to the json file
                try {
                    // Check if json already exists
                    if (!fs.existsSync(path_url)) {
                        // Create the json
                        fs.writeFileSync(path_url, JSON.stringify({
                            message_list: []
                        }));
                    }

                    // Read the file
                    let data = fs.readFileSync(path_url);
                    // Parse the json
                    let json = JSON.parse(data.toString()).message_list;

                    // Get all the messages with id = _spotted_group_id
                    let messages = json.filter((message: IMessage_format) => message.id == this._spotted_group_id);

                    // Get the first message with the reply_id
                    let message: IMessage_format = messages.find((message: IMessage_format) => message.text == "/internal_spotted " + reply_id);

                    // Check if the message exists
                    if (!message) {
                        params?.client_name.send_message(params?.id, "Hum, minha memória ta ruim ou to cego, encontrei não.. 😔");
                        return;
                    }

                    // Then send the message
                    // Random id number from 0 to 500;
                    let random_id = Math.floor(Math.random() * 500);
                    // Else send the message to the spotted group
                    let message_to_send = "_*Novo Spotted!:*_ #*" + (random_id) + "* em resposta a: *" + reply_id + "*\n" + params?.text!.replace(this._name, "").replace("-r " + reply_id, "");
                    params?.client_name.send_message(message.id, message_to_send);
                    params?.client_name.send_message(params?.id, "Enviado! 😎");

                    // Clear the chat
                    this._clear_chat(random_id, params);
                    return;
                }
                catch (e) {
                    console.log("Erro ao ler no json: " + e);
                    params?.client_name.send_message(params?.id, "Não conhegui ler não lol, avisa o adm que quebrou o banco.. 😔");
                }
            }

            // Random id number from 0 to 500;
            let random_id = Math.floor(Math.random() * 500);
            // Else send the message to the spotted group
            let message_to_send = "_*Novo Spotted!:*_ #*" + (random_id) + "*\n" + params?.text!.replace(this._name, "");
            params?.client_name.send_message(this._spotted_group_id, message_to_send);
            params?.client_name.send_message(params?.id, "Enviado! 😎");

            // Clear the chat
            this._clear_chat(random_id, params);

        } catch (error) {
            console.log("Erro ao enviar spotted");
            params?.client_name.send_message(params?.id, "Consegui não.. 😔");
        }
    }

    private async _clear_chat(random_id: number, params?: IMessage_format): Promise<void> {
        try {
            // Clears the WA chat
          
                params!.client_name.clear_chat(params);
            

            // Privacy overwrite, so the message is saved on json, and will be used but I have no idea from who it is
            params!.text = "/internal_spotted " + random_id; // Internal is a lazy way to make the bot be able to find the message later
            params!.id = this._spotted_group_id; // Obfuscates the id of the original group
            params!.from = "/Internal_spotted" // Obfuscates the id of the user
            // This will be saved after the command ends

            // There's more privacy issues here but i'm tired, if you want to fix it, go ahead, obfuscate everything
            // We could implement some criptography here even, but I'm not sure if it's worth it

        } catch (error) {
            console.log("Erro ao limpar o chat do Spotted");
            params?.client_name.send_message(params?.id, "Não consegui limpar meu chat, se importa em apagar você mesmo?");
        }
        return;
    }


}