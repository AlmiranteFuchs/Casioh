import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import dotenv from "dotenv";

export class ChatGPTCommand extends CommandModel {
    protected _key = "gpt";
    protected _name = "/gpt (prompt)";
    protected _alias = undefined;
    protected _description = "Gera texto com base em um prompt";
    protected _access_level = 4;
    protected _active = true;
    protected _hidden = false;
    protected _limitedUse = true;
    protected _useLimit = 5;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Rodando GPT!");

        dotenv.config();

        let api_key = process.env.OPENAI_API_KEY;
        if (api_key == undefined) {
            params?.client_name.send_message(params?.id, "Não tem api key mano", params);
            return;
        }

        try {

            if (params?.command_params?.length == 0) {
                params?.client_name.send_message(params?.id, "Sim, quer dizer não, quer dizer sei lá mano o que diabos tu quer dizer com isso?", params);
            }
            
            const { Configuration, OpenAIApi } = require("openai");

            const configuration = new Configuration({
                apiKey: api_key,
            });

            const openai = new OpenAIApi(configuration);

            openai.createCompletion({
                model: "text-davinci-001",
                prompt: params?.command_params?.join(" "),
                max_tokens: 300,
                temperature: 0.9,
            }).then((data: any) => {
                params?.client_name.send_message(params?.id, (data.data.choices[0].text as string).trim(), params);
            }).catch((error: any) => {
                console.log("Erro em GPT: ", error);
                params?.client_name.send_message(params?.id, "To com preguiça de te responder mano: " + error, params);
            });

        } catch (error) {
            console.log("Erro em GPT: ", error);
            params?.client_name.send_message(params?.id, "To com preguiça de te responder mano: " + error, params);
        }
    }

}