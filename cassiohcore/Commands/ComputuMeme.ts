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
            if (this._options?.includes("-s") || this._options?.includes("-u")) {
                console.log("Saving new image on /meme");

                // Make the hash of the saved image
                const { imageHash } = require('image-hash');
                const fBuffer = fs.readFileSync(__dirname + '/CommandsAssets/downloads/recent.jpeg');
                let hash:any;
                
                await imageHash({
                    data: fBuffer
                }, 16, true, (error: any, data: any) => {
                    if (error) throw error;
                    hash = data;
                });


                if (await this._save_image(hash)) {
                    params!.client_name.send_message(params?.id, "Salvo ;)", params);
                    if (this._options?.includes("-u")) {
                        let file_path = "cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/" + hash;

                        cmd.run(
                            `cd cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator
                            python3 chroma_key.py ${file_path}`,
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
                params!.client_name.send_message(params?.id, "Não consegui lmao", params);
                return;
            }

            // await for python to finish
            cmd.run(
                `cd cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator
                python3 chroma_key.py`,
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

        } catch (error) {
            console.log("Erro ao executar comando: " + error);
            params?.client_name.send_message(params?.id, "Não rolou ai ;c : " + error, params);
        }
    }

    private async _save_image(image_hash: string): Promise<boolean> {

        // Get the saved image 
        let image_path: string = "cassiohcore/Commands/CommandsAssets/downloads/recent.jpeg";
        let save_dir_path: string = "cassiohcore/Commands/CommandsAssets/MemeGen/Computudos-Simulator/figures/" + image_hash;

        fs.rename(image_path, save_dir_path, function (err) {
            if (err) {
                console.log("error on saving");
                return false;
            }
            console.log('Successfully renamed - AKA moved!');
            return true;
        });
        return false;
    }

}