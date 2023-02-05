import { SessionController } from "../Controller/SessionController";
import { IMessage_format } from "./MessageModel";
import fs from 'fs';

export abstract class CommandModel {
    //constructor(public _nome: string, private _access_level: number) { }
    protected abstract _key: string;
    protected abstract _name: string;
    // Optional alias
    protected abstract _alias?: string;
    protected abstract _options?: string[];       // Opções do comando
    protected abstract _description: string;
    protected abstract _access_level: number;
    protected abstract _active: boolean;           //Define se é executável a qualquer momento
    protected abstract _hidden: boolean;           //Define se aparece no /help
    protected abstract _limitedUse?: boolean;       //Define se o comando pode ser usado apenas algumas vezes por sessão
    protected abstract _useLimit?: number;          //Define o limite de uso do comando por sessão

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

    get limitedUse(): boolean {
        return this._limitedUse as boolean;
    }

    get useLimit(): number {
        return this._useLimit as number;
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

    protected check_use_limit(limitedUse: boolean, useLimit: number, user_id: string, command_key: string): boolean {
        /***
         * Retorna se o usuário tem acesso ao comando com seus usos limitados
         * @param {boolean}
         * @param {number}
         * @param {string}
         * ---------------------------------------------
         * 
        */

        if (limitedUse) {
            // FIXME: Implementar controle de uso de comandos, banco de dados
            // Read from json
            // Check if user has used the command before

            let json_path = "cassiohcore/Commands/CommandsAssets/userUse.json";

            // load json with fs
            let json_data = JSON.parse(fs.readFileSync(json_path, 'utf8'));

            // check if user has used the command before
            if (json_data[user_id] === undefined) {
                json_data[user_id] = {};
                json_data[user_id]["lastUse"] = new Date().toLocaleDateString();
                json_data[user_id][command_key] = 1;

                // write to json
                fs.writeFileSync(json_path, JSON.stringify(json_data));
                return true;
            } else if (json_data[user_id][command_key] === undefined) {
                json_data[user_id][command_key] = 1;
                // write to json
                fs.writeFileSync(json_path, JSON.stringify(json_data));
                return true;
            } else if (json_data[user_id]["lastUse"] !== new Date().toLocaleDateString()) {
                json_data[user_id]["lastUse"] = new Date().toLocaleDateString();
                json_data[user_id][command_key] = 1;
                // write to json
                fs.writeFileSync(json_path, JSON.stringify(json_data));
                return true;
            } else if (json_data[user_id][command_key] < useLimit) {
                json_data[user_id][command_key] += 1;
                // write to json
                fs.writeFileSync(json_path, JSON.stringify(json_data));
                return true;
            } else {
                return false;
            }


        } else {
            return true;
        }

    }

    public async Exec_command(access_level: number, params?: IMessage_format): Promise<boolean> {
        /***
         * Referência pública para checar acesso o método abstrato na instância
         */
        if (!this._active) {
            console.log("Comando desativado no momento");
            return false;
        }

        if (this.check_use_limit(this._limitedUse as boolean, this._useLimit as number, params?.from as string, this._key) === false) {
            console.log("Limite de uso do comando atingido");
            let message: string = "Você já usou esse comando hoje, mais do que devia, tente novamente amanhã 🤷🏽‍♂️";

            params?.client_name.send_message(params!.id!, message, params);
            return false;
        }

        if (this.check_access_level(access_level)) {
            await this.execute_command(params);
            return true;
        } else {
            //TODO: tratamento de negação
            console.log("Usuário sem acesso ao comando");
            let message: string = "Sinto muito meu caro, mas parece que eu não confio em você pra fazer isso ai 🤷🏽‍♂️";

            params?.client_name.send_message(params!.id!, message, params);
            return false;
        }
    }

    protected abstract execute_command(params?: IMessage_format): void;
}
