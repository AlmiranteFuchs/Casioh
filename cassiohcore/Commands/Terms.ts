import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import terms from "./CommandsAssets/use_terms.json";

export class TermsCommand extends CommandModel {
    protected _key: string = "terms";
    protected _name: string = "/terms";
    protected _alias: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "Mostra os termos de uso do bot";
    protected _access_level:number = 0;
    protected _active:boolean = true;
    protected _hidden:boolean = true;
    protected _limitedUse:boolean = false;
    protected _useLimit:number = 0;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando terms!");

        try {

            // Get the terms of use json
            // Read the terms of use
            let terms_content = terms["terms"];

            // Send the terms of use
            params?.client_name.send_message(params?.id, terms_content, params);

        } catch (error) {
            console.log("Error in terms command: " + error);
        }
    }

}