// I'm going to regret this
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import fs from "fs";
import copypastas from "./CommandsAssets/copypasta.json";
import path from "path";

export class CopypastaCommand extends CommandModel {
    protected _key: string = "copypasta";
    protected _options?: string[] | undefined = undefined;
    protected _alias: string = "c";
    protected _name: string = "/copypasta (nome_copypasta) (copypasta)";
    protected _description: string = "Cria uma copypasta com o nome e o conteúdo especificados";
    protected _access_level: number = 4;
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _limitedUse: boolean = false;
    protected _useLimit: number = 0;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando copypasta!");

        try {
            // Used to save on write
            let cp_path = path.resolve(__dirname, "./CommandsAssets/copypasta.json");

            // Test if the command has parameters
            if ((params!.command_params)!.length == 0) {
                params?.client_name.send_message(params?.id, "Brother tu não entendeu como funciona o comando?", params);
                return;
            }

            if ((params!.command_params)!.length == 1) {
                // search for the copypasta
                let copypasta = (params!.command_params)![0];


                if (copypasta == "list") {
                    let copypastas_list = "";
                    for (let i = 0; i < Object.keys(copypastas).length; i++) {
                        copypastas_list += Object.keys(copypastas)[i] + "\n";
                    }
                    params?.client_name.send_message(params?.id, copypastas_list, params);
                    return;
                }

                let copypasta_content = (copypastas as any)[copypasta];

                // if the copypasta exists, send it
                if (copypasta_content) {
                    params?.client_name.send_message(params?.id, copypasta_content, params);
                } else {
                    params?.client_name.send_message(params?.id, "Brother, essa copypasta não existe", params);
                }
                return;
            }

            if ((params!.command_params)!.length > 1) {
                // Create a new copypasta
                let copypasta_name = (params!.command_params)![0];

                // All params after the first one
                let copypasta_content = (params!.text)!.split(" ").slice(2).join(" ");

                // if the copypasta exists, send it
                if ((copypastas as any)[copypasta_name]) {
                    params?.client_name.send_message(params?.id, "Brother, essa copypasta já existe", params);
                } else {
                    (copypastas as any)[copypasta_name] = copypasta_content;
                    // write in the json
                    fs.writeFile(cp_path, JSON.stringify(copypastas), function (err: any) {
                        if (err) {
                            console.log("Erro ao escrever no arquivo copypasta.json: ", err);
                            params?.client_name.send_message(params?.id, "Meu chegado, deu erro 😢, consegui salvar não lol", params);
                        }
                    });
                    params?.client_name.send_message(params?.id, "Copypasta criada com sucesso", params);
                }
                return;
            }
        } catch (error) {
            console.log("Erro em copypasta: ", error);
            params?.client_name.send_message(params?.id, "Meu chegado, deu erro 😢", params);
        }
    }

}