// I'm going to regret this
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class CopypastaCommand extends CommandModel {
    protected _key = "copypasta";
    protected _alias= "c";
    protected _name = "/copypasta (nome_copypasta) (copypasta)";
    protected _description = "Cria uma copypasta com o nome e o conteúdo especificados";
    protected _access_level = 4;
    protected _active = true;
    protected _hidden = false;
    protected _limitedUse = false;
    protected _useLimit = 0;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando copypasta!");

        try {

            // Test if the command has parameters
            if ((params!.command_params)!.length == 0) {
                params?.client_name.send_message(params?.id, "Brother tu não entendeu como funciona o comando?", params);
                return;
            }

            if ((params!.command_params)!.length == 1) {
                // search for the copypasta
                let copypasta = (params!.command_params)![0];

                // search for the copypasta in the json file
                let copypastas = require("./CommandsAssets/copypasta.json");

                if(copypasta == "list"){
                    let copypastas_list = "";
                    for (let i = 0; i < Object.keys(copypastas).length; i++) {
                        copypastas_list += Object.keys(copypastas)[i] + "\n";
                    }
                    params?.client_name.send_message(params?.id, copypastas_list, params);
                    return;
                }

                let copypasta_content = copypastas[copypasta];

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

                // search for the copypasta in the json file
                let copypastas = require("./CommandsAssets/copypasta.json");

                // if the copypasta exists, send it
                if (copypastas[copypasta_name]) {
                    params?.client_name.send_message(params?.id, "Brother, essa copypasta já existe", params);
                } else {
                    copypastas[copypasta_name] = copypasta_content;
                    // write in the json
                    const fs = require('fs');
                    fs.writeFile("./cassiohcore/Commands/CommandsAssets/copypasta.json", JSON.stringify(copypastas), function (err: any) {
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