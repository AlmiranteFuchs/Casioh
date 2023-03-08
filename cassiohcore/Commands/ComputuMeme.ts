import { path } from "@ffmpeg-installer/ffmpeg";
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";


export class MemesCommand extends CommandModel {
    protected _key: string = "meme";
    protected _name: string = "/meme";
    protected _alias?: string | undefined = "m";
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "Envia um meme aleatório dos computudos";
    protected _access_level: number = 4;
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _limitedUse?: boolean | undefined = undefined;
    protected _useLimit?: number | undefined = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void>  {
        console.log("Rodando meme!");
        try {
            const cmd: any = require('node-cmd');

            // await for python to finish
            cmd.run(
                `cd cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator
                python3 chroma_key.py`,
                function (err: any, data: any, stderr: any) {
                    if (!err) {
                        params?.client_name.send_message(params?.id, "Ok lol", params);
                        // Send the image result.png
                        
                        const image_path:string = "cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/result.png";
                        params!.specific.image = image_path;
                        params?.client_name.send_message(params?.id, image_path, params);
                    } else {
                        console.log('error', err);
                        params?.client_name.send_message(params?.id, "Não rolou ai ;c : " + err, params);
                    }
                }
            );

        } catch (error) {
            console.log("Erro ao executar comando: " + error);
            params?.client_name.send_message(params?.id, "Não rolou ai ;c : " + error, params);
        }
    }

}