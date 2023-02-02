import { SessionController } from "../Controller/SessionController";
import { IMessage_format } from "./MessageModel";

export abstract class CommandModel {
    //constructor(public _nome: string, private _access_level: number) { }
    protected abstract _key: string;
    protected abstract _name: string;
    // Optional alias
    protected abstract _alias?: string;
    protected abstract _description: string;
    protected abstract _access_level: number;
    protected abstract _active: boolean;           //Define se é executável a qualquer momento
    protected abstract _hidden: boolean;           //Define se aparece no /help

    get key(): string {
        return this._key;
    }

    get alias(): string {
        return this._alias as string;
    }

    get name(): string {
        return this._name;
    }
    get description(): string {
        return this._description;
    }

    get access_level(): number {
        return this._access_level;
    }

    get hidden(): boolean {
        return this._hidden
    }

    get active(): boolean {
        return this._active
    }

    protected check_access_level(access_level: number): boolean {
        /***
         * Retorna se o usuário tem acesso ao comando
         * @param {number} access_level Nível do usuário
         * ---------------------------------------------
         * 0 - root
         * 1 - adm
         * 2 - CAAD
         * 3 - trusted
         * 4 - plebe
         */

        let response = (access_level <= this._access_level && access_level >= 0) ? true : false;
        return response;
    }

    public async Exec_command(access_level: number, params?: IMessage_format): Promise<boolean> {
        /***
         * Referência pública para checar acesso o método abstrato na instância
         */
        if (!this._active) {
            console.log("Comando desativado no momento");
            return false;
        }

        if (this.check_access_level(access_level)) {
            await this.execute_command(params);
            return true;
        } else {
            //TODO: tratamento de negação
            console.log("Usuário sem acesso ao comando");
            let message: string = "Sinto muito meu caro, mas parece que eu não confio em você pra fazer isso ai 🤷🏽‍♂️";

            params!.specific.reply = true;
            params?.client_name.send_message(params!.from!, message, params);
            return false;
        }
    }

    protected abstract execute_command(params?: IMessage_format): void;
}
