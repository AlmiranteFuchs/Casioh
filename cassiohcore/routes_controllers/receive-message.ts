import { Request, Response } from "express";
import { CommandsControllers } from "..";
import { CommandsControllerService } from "../Controller/CommandsController";
import { IMessage_format } from "../Modal/MessageModel";

class receiverController {
  public receive(req: Request, res: Response) {
    let message: IMessage_format = req.body.message ?? null;
    if (message) {
      // TODO: send message to the command service

      CommandsControllers.Command_service.Run_command(0, message);
      return res.sendStatus(200);
    }
    return res.send("No message received").status(400);
  }
}
export const receiver_controller = new receiverController();
