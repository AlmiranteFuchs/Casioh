export default
    class Command_Model {
    constructor(public nome: string, public access_level: number) { }

    console_nome(): void {
        //Faz algo sem return
        console.log(this.nome);
    }

    check_access_level(_access_level: number): boolean {
        let response = _access_level > this.access_level ? true : false;
        return response; 
    }
}
