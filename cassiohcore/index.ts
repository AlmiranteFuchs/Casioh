import { CommandsControllerService } from "./Controller/CommandsController";
import express, { Express, Request, Response } from 'express';

import * as dotenv from 'dotenv';
import { CaadReceipt } from "./websocket";
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
const http: any = require("http");
const port: any = process.env.PORT || 4000;

import { App } from "./app";

new App().server.listen(port, () => { console.log(`[Cassioh]: Server is running at http://localhost:${port}`); });