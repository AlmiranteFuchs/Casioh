import axios, { Axios } from "axios";
import dotenv from "dotenv";
import qrcode from "qrcode-terminal";
import { Base64 } from "js-base64";
import { baileys_api } from "../Modal/WAEngines/baileys";
import { API } from "../Modal/WAEngines/apiModel";

dotenv.config();

// Session Status
export enum SessionStatus {
  SESSION_NOT_STARTED,
  SESSION_NOT_LOGGED,
  SESSION_STARTED,
  SESSION_EXPIRED,
  SESSION_ERROR,
}

// static class to manage the session
export abstract class SessionController {
  /***
   * Controla uma instância do Cassioh
   */

  public static client: API;

  public static async init_session(): Promise<void> {
    /***
     * Inicia a sessão
     */
    console.log(`[Cassioh]: Iniciando sessão...`);

    this.client = new baileys_api();
    return;
  }

  public static async getInstance(): Promise<API> {
    /***
     * Retorna a instância do Cassioh
     */
    return this.client;
  }
}
