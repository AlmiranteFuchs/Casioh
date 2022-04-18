import { HelloWorldCommand } from "./cassiohcore/Commands/HelloWorld";
import { CommandsControllerService } from "./cassiohcore/Controller/CommandsController";
import { CommandModel } from "./cassiohcore/Modal/CommandModel";

//
let user_access: number = 0;
let key: string = "olá";

let commands_array: Array<CommandModel> = [];
let command_hello = new HelloWorldCommand();

commands_array.push(command_hello);

let command_service = new CommandsControllerService(commands_array);
command_service.Run_command(key, user_access);