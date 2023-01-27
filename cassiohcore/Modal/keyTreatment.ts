
export class KeyTreatment {
    public static Params_command(client?: any, message?: any, specific?: any): any {
        try {
            message.text = message.type == "list_response" ? message.body : message.text;
            let _message_params: params_to_command = {
                id: message.messages[0].key.remoteJid,
                body: message.body,
                text: message.text,
                type: message.type == "chat" ? chat_type.chat : message.type == "image" ? chat_type.image : chat_type.unknown,
                from: message.from,
                to: message.to,
                isForwarded: message.isForwarded,
                chat_id: message.chatId,
                isFrom_group: message.isGroupMsg,
                isMedia: message.isMedia,
                last_chat_message_id: message.chat.lastReceivedKey._serialized,
                not_Spam: message.chat.notSpam,
                sender_id: message.sender.id,
                sender_name: message.sender.pushname,
                sender_number: message.sender.formattedName,
                sender_pfp: message.sender.profilePicThumbObj.imgFull,
                //Params
                command_params: message.text.split(/\s*[\s,]\s*/),
                command_key: message.text.split(/\s*[\s,]\s*/)[0].substring(1).toLowerCase(), //Retira "/"
                command_key_raw: message.text.split(/\s*[\s,]\s*/)[0], //Retira "/"
                specific: specific,
                //Venom
                client: client

            };
            _message_params.command_params?.shift();
            return _message_params;
        } catch (error) {
            console.log(`Erro em transcrição de leitura da mensagem enviada \n ${error}`);
        }
    }
}

export interface params_to_command {
    //Message
    id?: string;
    body?: string;
    text?: string;
    type?: chat_type;
    from?: string;
    to?: string;
    isForwarded?: boolean;
    chat_id?: string;
    isFrom_group?: boolean;
    isMedia?: boolean;
    last_chat_message_id?: string;
    not_Spam?: boolean;
    //Sender
    sender_id?: string;
    sender_name?: string;
    sender_number?: string;
    sender_pfp?: string;
    //Extra params
    command_key?: string;
    command_key_raw?: string;
    command_params?: Array<string>;
    specific?: any;
    //Venom Client
    client?: any
}

enum chat_type {
    image = "image",
    chat = "chat",
    list_response = "list_response",
    unknown = "unknown"
}
