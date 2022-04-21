import { SendReplyCommand } from "../Commands/SendReply";
import { params_to_command } from "./keyTreatment";

export abstract class CommandModel {
    //constructor(public _nome: string, private _access_level: number) { }
    protected abstract _key: string;
    protected abstract _name: string;
    protected abstract _description: string;
    protected abstract _access_level: number;

    get key(): string {
        return this._key;
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

    public Exec_command(access_level: number, params?: params_to_command): boolean {
        /***
         * Referência pública para checar acesso o método abstrato na instância
         */
        if (this.check_access_level(access_level)) {
            this.execute_command(params);
            return true;
        } else {
            //TODO: tratamento de negação
            console.log("Usuário sem acesso ao comando");
            let message: string = "Sinto muito meu caro, mas parece que eu não confio em você pra fazer isso ai 🤷🏽‍♂️";
            params?.client.reply(
                params?.from,
                message,
                params?.id
            );
            return false;
        }
    }

    protected abstract execute_command(params?: params_to_command): void;
}
