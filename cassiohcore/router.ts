import dotenv from 'dotenv';
import { Router } from 'express';
import { home_controller } from './routes_controllers/home';
import { private_controller } from './routes_controllers/private';
import { createAuthorizationMiddleware } from "./middleware";
import { CommandsControllerService } from './Controller/CommandsController';
import { receiver_controller } from './routes_controllers/receive-message';

dotenv.config();
const command_service = new CommandsControllerService().Command_service;

const secret: string = process.env.auth_secret as string;
const router: Router = Router();

//Rotas
router.get('/', home_controller.Home);
//router.post('/receive-message', receiver_controller.receive);
export { router };