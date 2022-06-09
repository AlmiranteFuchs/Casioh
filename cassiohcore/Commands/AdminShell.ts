import { CommandModel } from "../Modal/CommandModel";
import { params_to_command } from "../Modal/keyTreatment";
import { SendReplyCommand } from "./SendReply";

export class AdminShellCommand extends CommandModel {
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _name: string = "/cmd";
    protected _description: string = "Se você está lendo isso algo muito errado acontece...";
    protected _key: string = "cmd";
    protected _access_level: number = 0;

    protected async execute_command(params?: params_to_command): Promise<void> {
        console.log("!!!!Rodando cmd!!!!");
        try {

            let root_pws: string = params?.command_params[0];
            let cmd_command: string = params?.text.split(root_pws)[1];
            let payload: object = { 'text_reply': "Opa amigão, você está voando muito perto do sol... De falha é meu mestre mas falha é nosso acordo" };


            if (root_pws == process.env.ROOT_PWS && cmd_command) {

                let message: string = "";

                var exec: any = require('child_process').exec;
                var cmd: any = exec(cmd_command);

                cmd.stdout.setEncoding('utf8');
                cmd.stdout.on('data', function (data: any) {
                    console.log(data);
                    message += data;
                });

                cmd.stderr.setEncoding('utf8');
                cmd.stderr.on('data', function (data: any) {
                    console.log(data);
                    message += data;
                });

                cmd.on('close', function (code) {
                    payload = { 'text_reply': message + `\n\nClosing code: ${code}` };
                    params!.specific = payload;
                    let command_result = new SendReplyCommand().Exec_command(0, params);
                })
            } else {
                params!.specific = payload;
                let command_result = new SendReplyCommand().Exec_command(0, params);
            }

        } catch (error) {
            console.log("!! Erro em CMD !!: ", error);
        }
    }


}