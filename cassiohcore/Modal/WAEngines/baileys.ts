import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
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
            console.log('[Cassioh]: received message', m.messages[0].message?.conversation);

            // Keep working here, find a way to work with the message to a default interface, then send to the command service
            /*   let message: IMessage_format = m ?? null;
              if (message) {
                  // TODO: send message to the command service
  
                  CommandsControllers.Command_service.Run_command(0, message);
              } */
        })
    }

    // Public API
    public async send_message(to: string, message: string, options?: any): Promise<boolean> {
        try {
            await this.client.sendMessage(to, { text: message });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public async send_image(to: string, image: string, caption: string, options?: any): Promise<boolean> {
        return false;
    };


}

