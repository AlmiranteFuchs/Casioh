import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { CommandsControllers } from '../..';
import { IMessage_format } from '../MessageModel';
import { API, SessionStatus } from './apiModel';


export class baileys_api implements API {
    client: any;
    session_status: SessionStatus;

    constructor() {
        this.session_status = SessionStatus.SESSION_NOT_STARTED;
        this.init();
    }


    public async init() {
        console.log("[Cassioh]: Initializing baileys...");

        this.connectToWhatsApp();
    }

    private async connectToWhatsApp() {
        // Auth
        const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys/cassioh`);
        const sock = makeWASocket({
            // can provide additional config here
            auth: state,
            printQRInTerminal: true
        } as any);

        // Update object
        this.client = sock;
        this.session_status = SessionStatus.SESSION_NOT_LOGGED;

        // Events
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                this.session_status = SessionStatus.SESSION_NOT_LOGGED;

                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('[Cassioh]: connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    this.connectToWhatsApp();
                }
            } else if (connection === 'open') {
                this.session_status = SessionStatus.SESSION_STARTED;
                console.log('[Cassioh]: opened connection');
            }
        });
        sock.ev.on('messages.upsert', async m => {
            console.log('[Cassioh]: message received');

            // Check if message is from the bot
            if (m.messages[0].key.fromMe) return;
            // Check if message starts with the prefix
            if (!m.messages[0].message?.conversation?.startsWith("/")) return;

            let formatted_message = this.parse_message(m);

            CommandsControllers.Command_service.Run_command(0, formatted_message);
        })
    }

    // Public API
    public async send_message(to: string, message: string, options?: IMessage_format): Promise<boolean> {
        try {
            await this.client.sendMessage(to, {
                text: message, footer: options?.specific.footer,
                templateButtons: options?.specific.templateButtons, title: options?.specific.title,
                buttonText: options?.specific.buttonText, mentions: options?.specific.mentions
            }, { quoted: options?.message });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public async send_image(to: string, image: string, caption: string, options?: IMessage_format): Promise<boolean> {
        throw new Error("Method not implemented.");
    };

    public async get_group_members(group_id: string): Promise<Array<string>> {
        try {
            let members = await this.client.groupMetadata(group_id);


            return members.participants.map((member: any) => member.id);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public parse_message(message: any): IMessage_format {
        let msg = message.messages[0];
        return {
            //Message
            id: msg.key.remoteJid,
            body: msg.message.conversation ?? msg.message.extendedTextMessage.text,
            text: msg.message.conversation ?? msg.message.extendedTextMessage.text,
            /* type : chat_type, */
            from: msg.key.participant ?? msg.key.remoteJid,
            to: "",
            isForwarded: msg.message.conversation == null ? true : false,
            chat_id: msg.key.remoteJid,
            isFrom_group: msg.key.remoteJid.includes("@g.us"),
            _serialized_chat_id: "",
            isMedia: false,
            last_chat_message_id: "",
            not_Spam: false,
            timestamp: msg.messageTimestamp,
            //Sender
            sender_id: msg.key.participant,
            sender_name: msg.pushname ?? msg.key.participant,
            sender_number: msg.key?.participant?.split("@")[0],
            sender_pfp: "",
            //Extra params
            // Command params, remove first element (command key)
            command_params: (msg.message.conversation ?? msg.message.extendedTextMessage.text).split(/\s*[\s,]\s*/).slice(1),
            command_key: (msg.message.conversation ?? msg.message.extendedTextMessage.text).split(/\s*[\s,]\s*/)[0].substring(1).toLowerCase(),
            command_key_raw: (msg.message.conversation ?? msg.message.extendedTextMessage.text).split(/\s*[\s,]\s*/)[0],
            specific: {},
            // This class passed to commands
            client_name: this,
            message: msg
        }
    }

}


