import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class StickerCommand extends CommandModel {
    protected _key = "sticker";
    protected _alias = "s";
    protected _name = "/sticker (url || imagem anexada)";
    protected _description = "Envia um sticker com a imagem especificada ou por url";
    protected _access_level = 4;
    protected _active = true;
    protected _hidden = false;
    protected async execute_command(params?: IMessage_format | undefined): Promise<void> {
        console.log("Rodando sticker!");

        try {
            // Get the image url on the param
            let image_url = "";
            if (params?.command_params?.length == 0) {
                // If there is no param, get from recent.jpeg
                image_url = "cassiohcore/Commands/CommandsAssets/downloads/recent.jpeg";

                // Convert to webp and resize to 512x512
                let sharp = require("sharp");
                await sharp(image_url)
                    .resize(512, 512)
                    .webp()
                    .toFile("./cassiohcore/Commands/CommandsAssets/downloads/sticker.webp", (err: any, info: any) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(info);
                        image_url = "cassiohcore/Commands/CommandsAssets/downloads/sticker.webp";
                    });

            } else {
                // If there is a param, get from the param
                params?.client_name.send_message(params?.id, "Ahm... Não implementei ainda pra pegar url, fica de boa ai" + params?.command_params, params);
                return;
            }

            // Send the sticker
            params!.specific.sticker = image_url;
            params?.client_name.send_message(params?.id, image_url, params);

        } catch (error) {
            console.log(error);
            params?.client_name.send_message(params?.id, "Vish... Deu não, saca ai: " + error, params);

        }

    }

}