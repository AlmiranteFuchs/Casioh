import makeWASocket, { DisconnectReason, useMultiFileAuthState, downloadMediaMessage } from '@adiwajshing/baileys'
import { writeFile } from 'fs/promises'
import { Boom } from '@hapi/boom'
import { CommandsControllers } from '../..';
import { IMessage_format } from '../MessageModel';
import { API, SessionStatus } from './apiModel';
import fs from 'fs';
import path from 'path';
import { LockersCommand } from '../../Commands/Lockers';


export class baileys_api implements API {
    client: any;
    session_status: SessionStatus;

    constructor() {
        this.session_status = SessionStatus.SESSION_NOT_STARTED;
        this.init();
    }


    public async init() {
        console.log("[Caadsioh]: Initializing baileys...");

        this.connectToWhatsApp();

        // Run once 
        setTimeout(() => {
            setInterval(() => {
                if (this.session_status == SessionStatus.SESSION_STARTED) {
                    let fake_message: IMessage_format = {
                        chat_id: "",
                        client_name: this,
                        command_key: "lockers",
                        message: "",
                        command_options: ["-internal"]
                    }
                    CommandsControllers.Command_service.Run_command(0, fake_message);
                }
            }, 1000 * 60 * 10);
        }, 5000);
    }

    private async connectToWhatsApp() {
        // Auth
        const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys/cassioh`);
        const sock = makeWASocket({
            // can provide additional config here
            auth: state,
            printQRInTerminal: true
        });

        // Update object
        this.client = sock;
        this.session_status = SessionStatus.SESSION_NOT_LOGGED;

        // Events

        // On credentials
        sock.ev.on('creds.update', saveCreds);

        // On con update
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                this.session_status = SessionStatus.SESSION_NOT_LOGGED;

                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('[Caadsioh]: connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    this.connectToWhatsApp();
                }
            } else if (connection === 'open') {
                this.session_status = SessionStatus.SESSION_STARTED;
                console.log('[Caadsioh]: opened connection');
            }
        });

        // On message
        sock.ev.on('messages.upsert', async m => {
            console.log('[Caadsioh]: message received');

            // Check if message is from the bot
            if (m.messages[0].key.fromMe) return;


            // Check if message starts with the prefix
            if (!m.messages[0].message?.conversation?.startsWith("!")) return;

            let formatted_message = this.parse_message(m);

            CommandsControllers.Command_service.Run_command(0, formatted_message);

            console.log(formatted_message.chat_id);
            

            // Saves the message to the database
            // Clear unused fields
            let copy = JSON.parse(JSON.stringify(formatted_message)) as IMessage_format; // For some fucking reason TS is using this as reference and not creating a fucking copy
            copy.client_name = undefined;
            this.save_message_json(copy);
        })
    }

    // Public API
    public async send_message(to: string, message: string, options?: IMessage_format): Promise<boolean> {
        try {

            // Send sticker, if sticker is true
            if (options?.specific.sticker) {

                // Reads the common and unic local file, url passed as message
                await this.client.sendMessage(to, {
                    sticker: fs.readFileSync(message)
                }, { quoted: options?.message });
                return true;
            }

            // Send audio, if audio is true
            if (options?.specific.audio) {
                // Reads the common and unic local file, url passed as message
                await this.client.sendMessage(to, { audio: { url: `./${message}` }, mimetype: 'audio/mp4' },
                    { url: message }, // can send mp3, mp4, & ogg
                );
                return true;
            }

            // Send image
            if (options?.specific.image) {
                // Reads the common and unic local file, url passed as message
                await this.client.sendMessage(to, {
                    image: fs.readFileSync(message)
                }, { quoted: options?.message });
                return true;
            }

            // Send message, with all params possible
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
        throw new Error("Method not used.");
    };

    // Optional 
    public async get_group_members(group_id: string): Promise<Array<string>> {
        // Get all members of a group
        try {
            let members = await this.client.groupMetadata(group_id);

            return members.participants.map((member: any) => member.id);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public async clear_chat(params: IMessage_format): Promise<boolean> {
        // Assume que a mensagem passada em params é a última mensagem do chat, função para limpar o chat on command
        try {
            await this.client.chatModify({
                delete: true,
                lastMessages: [{ key: params.message.key, messageTimestamp: params.message.messageTimestamp }]
            },
                params?.id);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    public parse_message(message: any): IMessage_format {
        // Transforms the message to a common format, used by the command service
        // Message object
        const msg: any = message.messages[0];

        // Message body, can be a text or a image caption
        const text: string = msg.message?.imageMessage?.caption ?? (msg.message.conversation ?? msg.message.extendedTextMessage.text);

        // Raw params, all words in the message, options and params
        const raw_params = text.split(/\s*[\s,]\s*/).slice(1);
        // Command params, all words that are not options
        const command_params: string[] = raw_params.filter((word: string) => !word.startsWith("-"));
        // Command options, all options starting with "-" 
        const options: string[] = raw_params.filter((word: string) => word.startsWith("-"));


        return {
            // Message Id, chat can be group or user and the same person
            id: msg.key.remoteJid,
            body: msg.message.conversation ?? msg.message.extendedTextMessage.text,
            text: text,
            // Unique id, users only have one
            from: msg.key.participant ?? msg.key.remoteJid,
            to: "",
            isForwarded: msg.message.conversation == null ? true : false,
            chat_id: msg.key.remoteJid,
            isFrom_group: msg.key.remoteJid.includes("@g.us"),
            _serialized_chat_id: "",
            isMedia: msg.message?.imageMessage ? true : false,
            last_chat_message_id: "",
            not_Spam: false,
            timestamp: msg.messageTimestamp,
            //Sender
            sender_id: msg.key.participant,
            sender_name: message.messages[0].pushName,
            sender_number: msg.key?.participant?.split("@")[0],
            sender_pfp: "",
            //Extra params
            // Command params, remove first element (command key)
            command_params: command_params,
            command_key: text.split(/\s*[\s,]\s*/)[0].substring(1).toLowerCase(),
            command_key_raw: text.split(/\s*[\s,]\s*/)[0],
            command_options: options,
            specific: {},
            // This class passed to commands
            client_name: this,
            // Copy of the original message object, passed up and down the chain
            message: msg
        }
    }

    public save_message_json(message: IMessage_format): boolean {

        const path_url = path.resolve(__dirname, '../../Commands/CommandsAssets/lastmessages.json');
        // Pushes the new message to the json file
        try {
            // Check if json already exists
            if (!fs.existsSync(path_url)) {
                // Create the json
                fs.writeFileSync(path_url, JSON.stringify({
                    message_list: []
                }));
            }

            // Read the file
            let data = fs.readFileSync(path_url);
            // Parse the json
            let json = JSON.parse(data.toString());
            // Push the new message
            json.message_list.push(message);
            // remove the first element, if the array is bigger than 100
            if (json.message_list.length > 100) {
                json.message_list.shift();
            }
            // Write the new json
            // Save altered json
            fs.writeFileSync(path_url, JSON.stringify(json));
            console.log("Mensagem salva no json");

            return true;

        }
        catch (e) {
            console.log("Erro ao salvar mensagem no json: " + e);
            return false;
        }
    }
}


