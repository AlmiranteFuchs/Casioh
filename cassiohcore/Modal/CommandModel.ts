export class Command_Model {
    constructor(public nome: string, private _access_level: number) { }

    public console_nome(): void {
        //Faz algo sem return
        console.log(`This name test ${this.nome}`);
    }

    private check_access_level(access_level: number): boolean {
        /***
         * Retorna se o usuário tem acesso ao comando
         * @param {number} access_level Nível do usuário
         */

        let response = (access_level <= this._access_level && access_level >= 0) ? true : false;
        return response;
    }

    public exec_command(access_level: number): void {
        /***
         * Método base, sobrescrito nas instâncias? Não pode ser abstrato... ;(
         */
        if (this.check_access_level(access_level)) {

        } else {
            //TODO: tratamento de negação
        }
    }
}
