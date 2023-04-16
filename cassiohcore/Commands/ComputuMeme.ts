import { path } from "@ffmpeg-installer/ffmpeg";
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import fs from 'fs';

export class MemesCommand extends CommandModel {
    protected _key: string = "meme";
    protected _name: string = "/meme";
    protected _alias?: string | undefined = "m";
    protected _options?: string[] | undefined = ["-s", "-u"];
    protected _description: string = "Envia um meme aleatório dos computudos";
    protected _access_level: number = 4;
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _limitedUse?: boolean | undefined = undefined;
    protected _useLimit?: number | undefined = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {

        console.log("Rodando meme!");
        try {
            const cmd: any = require('node-cmd');

            // command options
            if (params?.command_options?.includes("-s") || params?.command_options?.includes("-u")) {
                console.log("Saving new image on /meme");

                // Make the hash of the saved image
                const { imageHash } = require('image-hash');
                const fBuffer = fs.readFileSync(__dirname + '/CommandsAssets/MemeGen/Computudos-Simulator/result.png');

                await imageHash({
                    data: fBuffer
                }, 16, true, async (error: any, data: any) => {
                    if (error) {
                        params!.client_name.send_message(params?.id, "Não consegui, hash n funfou", params);
                        return;
                    };
                    // Callback
                    // Save
                    if (! await this._save_image(data, params)) {
                        params!.client_name.send_message(params?.id, "Não consegui salvar", params);
                        return;
                    } else {
                        params!.client_name.send_message(params?.id, "Salvei", params);
                    }


                    console.log(this._options);

                    if (params.command_options?.includes("-u")) {

                        this._use_image(params!, "cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/figures/" + data + ".jpeg")
                    }
                });
                return;
            } else {
                this._use_image(params!, "");
            }

        } catch (error) {
            console.log("Erro ao executar comando: " + error);
            params?.client_name.send_message(params?.id, "Não rolou ai ;c : " + error, params);
        }
    }

    private async _save_image(image_hash: string, params?:IMessage_format): Promise<boolean> {

        // Get the saved image 
        let image_path: string = "cassiohcore/Commands/CommandsAssets/downloads/recent.jpeg";
        let save_dir_path: string = `cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/figures/` + image_hash + ".jpeg";

        console.log(save_dir_path);
        

        fs.renameSync(image_path, save_dir_path);
        return true;
    }

    private async _use_image(params: IMessage_format, filename: string): Promise<void> {
        const cmd: any = require('node-cmd');

        // Remove everything from the string before figures
        filename = filename.split("figures/")[1];

console.log(`cd cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator
python3 chroma_key.py ${params.command_options?.includes("-u") ? params.command_options?.includes("-m") ? "-m" : "-f" : ""} ${filename ?? ""}`);


        cmd.run(
            `cd cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator
                    python3 chroma_key.py ${params.command_options?.includes("-u") ? "-f figures/" : ""}${filename ?? ""}`,
            function (err: any, data: any, stderr: any) {
                if (!err) {
                    params?.client_name.send_message(params?.id, "Ok lol", params);
                    // Send the image result.png

                    const image_path: string = "cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/result.png";
                    params!.specific.image = image_path;
                    params?.client_name.send_message(params?.id, image_path, params);
                } else {
                    console.log('error', err);
                    params?.client_name.send_message(params?.id, "Não rolou ai ;c : " + err, params);
                }
            }
        );
    }
}