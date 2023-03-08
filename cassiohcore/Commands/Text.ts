import { CommandModel } from "../Modal/CommandModel"
import { IMessage_format } from "../Modal/MessageModel";

export class TestCommand extends CommandModel{
    protected _key = "teste";
    protected _name = "teste";
    protected _alias = "t";
    protected _description = "This is a test";
    protected _access_level = 4;
    protected _active = true;
    protected _hidden = false;

    protected execute_command(params?: IMessage_format | undefined): void {
        console.log("Rodando Teste!");
        try {
            let message = "Teste de comando";

            params?.client_name.send_message(params?.id, message, params);
        } catch (error) {
            console.log("Erro em Teste: ", error);
            
        }
    }

}