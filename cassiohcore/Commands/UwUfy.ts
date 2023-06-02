import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

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
                let msg = params?.text!.substr(word_idx);
                if (msg === undefined) {
                    params?.client_name.send_message(params?.id, "Vc mandouwu o comando sem o comando? @‘~’@");
                    return;
                }

                let newmsg = ""
                for (let i = 0; i < msg.length; i++) {
                    switch (msg[i]) {
                        case 'r':
                        case 'l':
                            newmsg += 'w'
                            break
                        case 'L':
                        case 'R':
                            newmsg += 'W'
                            break
                        case 'u':
                            newmsg += 'uwu'
                            break
                        case 'U':
                            newmsg += 'Uwu'
                            break
                        default:
                            newmsg += msg[i]
                    }
                }

                params?.client_name.send_message(params?.id, msg);
                return;
            }
        } catch (error) {
            console.log("Ewwo ao enviaw mensagem UwUficada");
        }
    }
}
