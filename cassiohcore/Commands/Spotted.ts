import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class SpottedCommand extends CommandModel {
    protected _active: boolean = false;
    protected _hidden: boolean = false;
    protected _name: string = "/spotted";
    protected _description: string = "Redireciona uma mensagem anônimamente para o grupo do Spotted";
    protected _key: string = "spotted";
    protected _alias = undefined;
    protected _access_level: number = 4;
    protected _word_min_size: number = 5;
    protected _spotted_group_id: string = "120363023365772349@g.us";
    protected _limitedUse = false;
    protected _useLimit = 0;


    protected async execute_command(params?: IMessage_format): Promise<void> {
        console.log("Rodando Spotted!");
        let payload: object = {};

        // FIXME: fix this
        return;

    }


}