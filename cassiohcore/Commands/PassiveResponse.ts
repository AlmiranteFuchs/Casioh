import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import fs from 'fs';

interface passive_response {
    key: string,
    response: string,
    count: number,
    include_count: boolean
}

function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace);
}

export class PassiveResponse extends CommandModel {
    protected _key: string = "passive-not-used";
    protected _name: string = "passive-not-used";
    protected _alias?: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "passive-not-used";
    protected _access_level: number = 0;
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _limitedUse?: boolean | undefined = undefined;
    protected _useLimit?: number | undefined = 0;


    // Its like a counter, like copypasta but for passive responses

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando passive-not-used!");
        // Check passive-response json
        if (!this._check_json(__dirname + "/CommandsAssets/passive-response.json")) {
            //params!.client_name.send_message(params?.id, "Não consegui ;c", params);
            console.log("Não foi possível ler o arquivo");
            return;
        }

        // Check if the message is a command to add a new response
        if (params?.text?.toLowerCase()?.startsWith("!addresponse")) {
            // Check valid
            if (params?.command_params?.length! == 0) {
                params!.client_name.send_message(params?.id, "E cade o que tu quer adicionar?", params);
                return;
            }

            // Check if the key already exists
            if (this._get_specific_response(params?.command_params![0].toLowerCase()!)) {
                params!.client_name.send_message(params?.id, "Ja tem response pra isso", params);
                return;
            }

            // Get the key
            const options = params?.command_options!;
            const parameters = params?.command_params!;



            let key: string = replaceAll(replaceAll(options.join(" "), "-count", " "), "-", "").trim();
            let response: string = parameters.join(" ").trim();

            // create the response
            let new_response: passive_response = {
                key: key,
                response: response,
                count: 0,
                include_count: params?.command_options?.includes("-count")!
            }

            // Write the response
            if (this._write_specific_response(new_response)) {
                params!.client_name.send_message(params?.id, "Adicionado", params);
            } else {
                params!.client_name.send_message(params?.id, "Não consegui", params);
            }
        }

        const response = this._get_specific_response(params!.text?.toLowerCase()!);
        if (response) {
            response.count++;

            // Send the response
            params!.client_name.send_message(params?.id, response.response + `${response.include_count ? ("\n\n_*" + response.count + "* vezes_") : ""}`, params);
            this._write_specific_response(response);
        }
        // Do nothing

    }

    private _get_specific_response(key: string): passive_response | undefined {
        // filters the json file and returns the response that includes the key
        let json: any = JSON.parse(fs.readFileSync(__dirname + "/CommandsAssets/passive-response.json", "utf8"));
        let response: passive_response | undefined = undefined;

        json.passive_response.forEach((element: passive_response) => {
            if (element.key.includes(key)) {
                response = element;
                console.log("Found response: " + element.key + " - " + element.response);

            }
        });

        return response;
    }

    private _write_specific_response(passive_response: passive_response): boolean {
        // Check if the key already exists

        if (this._get_specific_response(passive_response.key)) {
            // Update the response
            let json: any = JSON.parse(fs.readFileSync(__dirname + "/CommandsAssets/passive-response.json", "utf8"));
            json.passive_response.forEach((element: passive_response) => {
                if (element.key == passive_response.key) {
                    element.response = passive_response.response;
                    element.count = passive_response.count;
                    element.include_count = passive_response.include_count;
                }
            });

            // Write the file
            try {
                fs.writeFileSync(__dirname + "/CommandsAssets/passive-response.json", JSON.stringify(json));
            }
            catch (error) {
                return false;
            }
            return true;
        } else {
            // Add the response
            let json: any = JSON.parse(fs.readFileSync(__dirname + "/CommandsAssets/passive-response.json", "utf8"));
            json.passive_response.push(passive_response);

            // Write the file
            try {
                fs.writeFileSync(__dirname + "/CommandsAssets/passive-response.json", JSON.stringify(json));
            }
            catch (error) {
                return false;
            }
            return true;
        }
    }

    private _check_json(path: string): boolean {
        if (!fs.existsSync(path)) {
            console.log("File not found, creating");

            try {
                // Write file
                fs.writeFileSync(path, JSON.stringify({
                    passive_response: []
                }));

            } catch (error: any) {
                return false;
            }

            return true;
        }
        return true;
    }

}