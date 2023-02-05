import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

import * as dotenv from "dotenv";

export class SpeechToTextCommand extends CommandModel {
    protected _key: string = "internal_speech_to_text";
    protected _name: string = "/internal_speech_to_text";
    protected _alias: string | undefined = undefined;
    protected _options?: string[] | undefined = undefined;
    protected _description: string = "Converte áudio em texto";
    protected _access_level: number = 4;
    protected _active: boolean = true;
    protected _hidden: boolean = true;
    protected _limitedUse: boolean = false;
    protected _useLimit: number = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Rodando STT!");

        dotenv.config();

        try {
            // Get key
            const key = process.env.WIT_AI_API_KEY;

            const file_name = params?.command_params![0];

            const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
            const ffmpeg = require('fluent-ffmpeg');
            ffmpeg.setFfmpegPath(ffmpegPath);

            let track = 'cassiohcore/Commands/CommandsAssets/downloads/' + file_name;//your path to source file

            // await ffmpeg(track)
            await new Promise<void>((resolve, reject) => {
                ffmpeg(track)
                    .toFormat('wav')
                    .on('error', (err: any) => {
                        console.log('An error occurred: ' + err.message);
                        reject();
                    })
                    .on('progress', (progress: any) => {
                        // console.log(JSON.stringify(progress));
                        console.log('Processing: ' + progress.targetSize + ' KB converted');
                    })
                    .on('end', () => {
                        console.log('Processing finished !');
                        resolve();
                    })
                    .save('cassiohcore/Commands/CommandsAssets/downloads/hello.wav');//path where you want to save your file
            });

            // Read audio file
            const fs = require('fs');
            const audio = fs.readFileSync('cassiohcore/Commands/CommandsAssets/downloads/hello.wav');

            // Use node-wit to speech to text
            const { Wit, log } = require('node-wit');
            const client = new Wit({ accessToken: key });

            // wit speech
            client.speech('audio/wav', audio).then((data: any) => {
                params?.client_name.send_message(params?.id, "Transcrição: " + data.text, params);
            }).catch((erro: any) => {
                console.log("Erro em STT: ", erro);
            });




        } catch (error) {
            console.log("Erro em STT: ", error);
        }

    }

}