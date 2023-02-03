import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class TextToSpeechCommand extends CommandModel {
    protected _key = "tts";
    protected _name = "/tts (texto)";
    protected _alias = undefined;;
    protected _description = "Converte texto em áudio";
    protected _access_level = 4;
    protected _active = true;
    protected _hidden = false;
    protected _limitedUse = false;
    protected _useLimit = 0;

    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Rodando TTS!");

        try {
            if (params?.command_params?.length == 0) {
                params?.client_name.send_message(params?.id, "Sim ta e tu quer que eu fale o que mano?? 😴", params);
                return;
            }

            if (params?.command_params![0] == "-transcribe") {
                params?.client_name.send_message(params?.id, "Ainda não implementado", params);
                return;
            }

            const gTTS = require('gtts');

            var speech = params?.command_params?.join(" ");
            var gtts = new gTTS(speech, 'pt-br');

            await gtts.save('cassiohcore/Commands/CommandsAssets/downloads/Voice.mp3', function (err: any, result: any) {
                if (err) { throw new Error(err); }
                console.log("Text to speech converted!");
                params!.specific.audio = true;
                params?.client_name.send_message(params?.id, "cassiohcore/Commands/CommandsAssets/downloads/Voice.mp3", params);
            });


        } catch (error) {
            console.log("Erro em TTS: ", error);
            params?.client_name.send_message(params?.id, "To com preguiça de falar: " + error, params);

        }

    }

}
