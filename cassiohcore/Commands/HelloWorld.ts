import { CommandModel } from "../Modal/CommandModel";

export class HelloWorldCommand extends CommandModel {
    protected _key: string = "olá";
    protected _access_level: number = 4;

    protected execute_command(): void {
        console.log("Aha Olá!!");

    }


}