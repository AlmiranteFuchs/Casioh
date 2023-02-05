import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class AdminShellCommand extends CommandModel {
    protected _active: boolean = false;
    protected _hidden: boolean = true;
    protected _options?: undefined = undefined;
    protected _alias: string = "cmd";
    protected _name: string = "/cmd";
    protected _description: string = "Se você está lendo isso algo muito errado acontece...";
    protected _key: string = "cmd";
    protected _access_level: number = 0;
    protected _limitedUse = false;
    protected _useLimit = 0;

    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("!!!!Rodando cmd!!!!");

        // FIXME: fix it
        return;
        try {

            let root_pws: string = (params as any).command_params[0] as any;
            let cmd_command: string = (params as any).text.split(root_pws)[1] as any;
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

                cmd.on('close', function (code:any) {
                    payload = { 'text_reply': message + `\n\nClosing code: ${code}` };
                    params!.specific = payload;
                })
            } else {
                params!.specific = payload;
            }

        } catch (error) {
            console.log("!! Erro em CMD !!: ", error);
        }
    }


}