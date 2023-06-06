import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export class UwUfyCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _name: string = "/uwufy (msg)";
    protected _alias?: string = "uwu";
    protected _description: string = "Manda uma vewsão UwUficada da mensagem";
    protected _key: string = "uwufy";
    protected _access_level: number = 4;
    protected _options?: string[] | undefined = undefined;
    protected _limitedUse?: boolean = false;
    protected _useLimit?: number = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Wodando UwUfy!");

        try {
            // Check if the user sent a message (copied from Spotted.ts lol)
            if (params?.command_params?.length == 0) {
                params?.client_name.send_message(params?.id, "Vc quwuew quwue euwu imagine o quwue vc quwuew mandauwu? @‘~’@");
                return;
            }

            let word_idx = params?.text!.indexOf(" ");
            if (word_idx === undefined) {
                params?.client_name.send_message(params?.id, "Vc mandouwu o comando sem o comando? @‘~’@");
                return;
            } else {
                let message_to_send = params?.text!.substr(word_idx);
                if (message_to_send === undefined) {
                    params?.client_name.send_message(params?.id, "Vc mandouwu o comando sem o comando? @‘~’@");
                    return;
                }
                message_to_send = replaceAll(message_to_send, "l", "w");
                message_to_send = replaceAll(message_to_send, "r", "w");
                message_to_send = replaceAll(message_to_send, "u", "uwu");
                message_to_send = replaceAll(message_to_send, "L", "W");
                message_to_send = replaceAll(message_to_send, "R", "W");
                message_to_send = replaceAll(message_to_send, "U", "Uwu");

                params?.client_name.send_message(params?.id, message_to_send);
                return;
            }
        } catch (error) {
            console.log("Ewwo ao enviaw mensagem UwUficada");
        }
    }
}