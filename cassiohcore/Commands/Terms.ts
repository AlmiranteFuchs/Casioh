import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class TermsCommand extends CommandModel {
    protected _key = "terms";
    protected _name = "/terms";
    protected _alias = undefined;
    protected _description = "Mostra os termos de uso do bot";
    protected _access_level = 0;
    protected _active = true;
    protected _hidden = true;
    protected _limitedUse = false;
    protected _useLimit = 0;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando terms!");

        try {

            // Get the terms of use json
            let terms = require("../../use_terms.json");

            // Read the terms of use
            let terms_content = terms["terms"];

            // Send the terms of use
            params?.client_name.send_message(params?.id, terms_content, params);

        } catch (error) {
            console.log("Error in terms command: " + error);
        }
    }

}