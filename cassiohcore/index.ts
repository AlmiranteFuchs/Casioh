import { CommandsControllerService } from "./Controller/CommandsController";
import express, { Express, Request, Response } from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

console.log(`
██████╗    █████╗    ███████╗   ███████╗   ██╗    ██████╗    ██╗  ██╗              ██╗   ██╗██████╗ 
██╔════╝   ██╔══██╗   ██╔════╝   ██╔════╝   ██║   ██╔═══██╗   ██║  ██║              ██║   ██║╚════██╗
██║        ███████║   ███████╗   ███████╗   ██║   ██║   ██║   ███████║    █████╗    ██║   ██║ █████╔╝
██║        ██╔══██║   ╚════██║   ╚════██║   ██║   ██║   ██║   ██╔══██║    ╚════╝    ╚██╗ ██╔╝ ╚═══██╗
╚██████╗██╗██║  ██║██╗███████║██╗███████║██╗██║██╗╚██████╔╝██╗██║  ██║               ╚████╔╝ ██████╔╝
 ╚═════╝╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚══════╝╚═╝╚═╝╚═╝ ╚═════╝ ╚═╝╚═╝  ╚═╝                ╚═══╝  ╚═════╝ 
By: Fuchs                                                                                                                                                                                                          
`);

//#region API Express Config

import { SessionController } from "./Controller/SessionController";

SessionController.init_session();

export let CommandsControllers = new CommandsControllerService();
