import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class RestartCommand extends CommandModel {
    // I don't have time to make this cool with auto git update and stuff

    protected _key: string = "internal_restart";
    protected _name: string = "/internal_restart";
    protected _alias: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "Restarts";
    protected _access_level: number = 0;
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _limitedUse: boolean = false;
    protected _useLimit: number = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Restarting...");

        try {
            params?.client_name?.send_message(params?.id, "It's getting sleepy right now", params);

            const { exec } = require("child_process");

            exec("npm run update", (error: any, stdout: any, stderr: any) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    params?.client_name?.send_message(params?.id, "Não consegui restartar" + error, params);

                    return;
                }
                console.log(`stdout: ${stdout}`);
            });

        } catch (error) {
            console.log("Error in restart command: " + error);
            params?.client_name?.send_message(params?.id, "Não consegui restartar" + error, params);
        }
    }

}