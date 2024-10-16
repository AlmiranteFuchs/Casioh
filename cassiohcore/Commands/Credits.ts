import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class InfoCommand extends CommandModel {
    protected _key: string = "info";
    protected _alias: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _name: string = "/info";
    protected _description: string = "Informações sobre o bot, versão e contribuidores";
    protected _access_level: number = 4;
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _limitedUse: boolean = false;
    protected _useLimit: number = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Rodando Info!");

        try {
            // Get the package.json version
            const package_json = require("../../package.json");
            const version = package_json.version;

            // Get all the contributors of the git repo
            var GitContributors = require('git-contributors').GitContributors;

            let path = require('path');
            let project_root_path = { cwd: path.resolve(__dirname, '../../'), markdown: false };

            GitContributors.list(project_root_path, function (err: any, result: any) {
                if (err) { throw err; }
                let contributors = JSON.stringify(result, null, 2);

                let names: string[] = [];
                for (let i = 0; i < result.length; i++) {
                    names.push(result[i].name);
                }


                // Send the message
                let message: string = "_*C.A.S.S.I.O.H*_ : Computer ASSisted Input & Output Helper\n*Versão*: " + "*" + version + "* " + "\n*Contribuidores*: _" + names.join(", ").toLocaleLowerCase().replace("bruno","efi") + "_ 🖤";
                params?.client_name.send_message(params?.id, message, params);
            });


        } catch (error) {
            console.log(error);
            params?.client_name.send_message(params?.id, "Vish... Deu não, saca ai: " + error, params);

        }

    }

}